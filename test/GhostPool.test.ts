import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostPool, GhostVault, GhostDraw, GhostVerifier, MockConfidentialToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GhostPool: Confidential Prize-Savings Pool", function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;

  let token: MockConfidentialToken;
  let vault: GhostVault;
  let verifier: GhostVerifier;
  let pool: GhostPool;
  let draw: GhostDraw;

  beforeEach(async function () {
    [owner, alice, bob, charlie] = await ethers.getSigners();

    // 1. Deploy Mock Confidential Token (cUSDC)
    const TokenFactory = await ethers.getContractFactory("MockConfidentialToken");
    token = (await TokenFactory.deploy("Confidential USDC", "cUSDC", 6)) as unknown as MockConfidentialToken;
    await token.waitForDeployment();

    // 2. Deploy GhostVerifier
    const VerifierFactory = await ethers.getContractFactory("GhostVerifier");
    verifier = (await VerifierFactory.deploy()) as unknown as GhostVerifier;
    await verifier.waitForDeployment();

    // 3. Deploy GhostVault
    const VaultFactory = await ethers.getContractFactory("GhostVault");
    vault = (await VaultFactory.deploy()) as unknown as GhostVault;
    await vault.waitForDeployment();

    // 4. Deploy GhostPool
    const PoolFactory = await ethers.getContractFactory("GhostPool");
    pool = (await PoolFactory.deploy(await token.getAddress())) as unknown as GhostPool;
    await pool.waitForDeployment();

    // 5. Deploy GhostDraw
    const DrawFactory = await ethers.getContractFactory("GhostDraw");
    draw = (await DrawFactory.deploy(
      await pool.getAddress(),
      await vault.getAddress(),
      await verifier.getAddress()
    )) as unknown as GhostDraw;
    await draw.waitForDeployment();

    // 6. Connect Protocol Contracts
    await pool.setProtocolContracts(await vault.getAddress(), await draw.getAddress());
    await vault.setProtocolAddresses(await pool.getAddress(), await draw.getAddress());
    await verifier.setDrawContract(await draw.getAddress());
  });

  describe("Deployment & Configuration", function () {
    it("should initialize with zero participants", async function () {
      expect(await pool.totalParticipants()).to.equal(0n);
    });

    it("should configure vault and draw addresses correctly", async function () {
      expect(await pool.vault()).to.equal(await vault.getAddress());
      expect(await pool.ghostDrawContract()).to.equal(await draw.getAddress());
    });
  });

  describe("Confidential Deposits", function () {
    it("should allow a user to deposit using encrypted input & proof", async function () {
      const mockCiphertext = ethers.toUtf8Bytes("FHE_CIPHERTEXT_1000_USDC");
      const mockProof = ethers.randomBytes(64);

      const tx = await pool.connect(alice).deposit(mockCiphertext, mockProof);
      const receipt = await tx.wait();

      expect(await pool.totalParticipants()).to.equal(1n);
      expect(await pool.isParticipant(alice.address)).to.be.true;
      expect(await pool.getParticipant(0)).to.equal(alice.address);

      // Verify Deposited event was emitted
      const depositEvents = receipt?.logs.filter((log) => {
        try {
          return pool.interface.parseLog(log)?.name === "Deposited";
        } catch {
          return false;
        }
      });
      expect(depositEvents?.length).to.be.greaterThan(0);

      // Verify the returned handle is valid bytes32
      const handle = await pool.getEncryptedBalanceHandle(alice.address);
      expect(handle).to.not.equal(ethers.ZeroHash);
    });

    it("should allow plaintext seed deposit helper", async function () {
      const amount = 500000000n; // 500 cUSDC (6 decimals)
      await pool.connect(bob).depositPlaintext(amount);

      expect(await pool.totalParticipants()).to.equal(1n);
      expect(await pool.isParticipant(bob.address)).to.be.true;

      const handle = await pool.getEncryptedBalanceHandle(bob.address);
      expect(handle).to.not.equal(ethers.ZeroHash);
    });
  });

  describe("Confidential Withdrawals", function () {
    it("should update encrypted balance handle upon withdrawal", async function () {
      // Alice deposits first
      await pool.connect(alice).depositPlaintext(1000000000n); // 1000 cUSDC
      const initialHandle = await pool.getEncryptedBalanceHandle(alice.address);

      // Alice withdraws 400 cUSDC
      const mockCiphertext = ethers.toUtf8Bytes("FHE_CIPHERTEXT_400_USDC");
      const mockProof = ethers.randomBytes(64);

      const tx = await pool.connect(alice).withdraw(mockCiphertext, mockProof);
      await tx.wait();

      const newHandle = await pool.getEncryptedBalanceHandle(alice.address);
      expect(newHandle).to.not.equal(initialHandle);
      expect(newHandle).to.not.equal(ethers.ZeroHash);
    });
  });
});
