import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostPool, GhostVault, GhostDraw, GhostVerifier, MockConfidentialToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PrivacyIntegrity: Zero Plaintext Leakage Audit", function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let observer: SignerWithAddress;

  let token: MockConfidentialToken;
  let vault: GhostVault;
  let verifier: GhostVerifier;
  let pool: GhostPool;
  let draw: GhostDraw;

  beforeEach(async function () {
    [owner, alice, bob, observer] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("MockConfidentialToken");
    token = (await TokenFactory.deploy("Confidential USDC", "cUSDC", 6)) as unknown as MockConfidentialToken;
    await token.waitForDeployment();

    const VerifierFactory = await ethers.getContractFactory("GhostVerifier");
    verifier = (await VerifierFactory.deploy()) as unknown as GhostVerifier;
    await verifier.waitForDeployment();

    const VaultFactory = await ethers.getContractFactory("GhostVault");
    vault = (await VaultFactory.deploy()) as unknown as GhostVault;
    await vault.waitForDeployment();

    const PoolFactory = await ethers.getContractFactory("GhostPool");
    pool = (await PoolFactory.deploy(await token.getAddress())) as unknown as GhostPool;
    await pool.waitForDeployment();

    const DrawFactory = await ethers.getContractFactory("GhostDraw");
    draw = (await DrawFactory.deploy(
      await pool.getAddress(),
      await vault.getAddress(),
      await verifier.getAddress()
    )) as unknown as GhostDraw;
    await draw.waitForDeployment();

    await pool.setProtocolContracts(await vault.getAddress(), await draw.getAddress());
    await vault.setProtocolAddresses(await pool.getAddress(), await draw.getAddress());
    await verifier.setDrawContract(await draw.getAddress());
  });

  describe("Event Log Privacy Audit", function () {
    it("should never emit plaintext deposit or withdrawal amounts in event topics or data", async function () {
      const depositAmount1 = 12345678n; // Unique number: 12.345678 cUSDC
      const depositAmount2 = 98765432n; // Unique number: 98.765432 cUSDC

      const tx1 = await pool.connect(alice).depositPlaintext(Number(depositAmount1));
      const receipt1 = await tx1.wait();

      const tx2 = await pool.connect(bob).depositPlaintext(Number(depositAmount2));
      const receipt2 = await tx2.wait();

      // Inspect every raw log emitted by the contract
      const allLogs = [...(receipt1?.logs || []), ...(receipt2?.logs || [])];

      for (const log of allLogs) {
        // Check topics
        for (const topic of log.topics) {
          // Assert that the exact deposit numbers are not present as raw unhashed integers
          expect(BigInt(topic)).to.not.equal(depositAmount1);
          expect(BigInt(topic)).to.not.equal(depositAmount2);
        }

        // Check data bytes
        if (log.data && log.data !== "0x") {
          const dataBigInt = BigInt(log.data);
          expect(dataBigInt).to.not.equal(depositAmount1);
          expect(dataBigInt).to.not.equal(depositAmount2);
        }
      }
    });
  });

  describe("Public View Privacy Audit", function () {
    it("should only expose opaque ciphertext handles to outside observers", async function () {
      await pool.connect(alice).depositPlaintext(777000000); // 777 cUSDC

      // Observer queries Alice's balance
      const handle = await pool.connect(observer).getEncryptedBalanceHandle(alice.address);

      // The returned value is a 32-byte ciphertext handle, not 777000000
      expect(handle).to.not.equal(ethers.ZeroHash);
      expect(BigInt(handle)).to.not.equal(BigInt(777000000));
    });

    it("should preserve participant position confidentiality during draw execution", async function () {
      await pool.connect(alice).depositPlaintext(50000 * 1e6); // Alice: whale (50,000 cUSDC)
      await pool.connect(bob).depositPlaintext(100 * 1e6);     // Bob: retail (100 cUSDC)

      await draw.openDraw();
      const tx = await draw.executeDraw();
      const receipt = await tx.wait();

      // Check all event logs from the draw execution
      const logs = receipt?.logs || [];
      for (const log of logs) {
        for (const topic of log.topics) {
          expect(BigInt(topic)).to.not.equal(BigInt(50000 * 1e6));
          expect(BigInt(topic)).to.not.equal(BigInt(100 * 1e6));
        }
      }

      // Observer inspects the public verifier
      const currentId = await draw.currentDrawId();
      const verification = await verifier.connect(observer).verifyDraw(currentId);

      // Verification shows validity, stateRoot, and winner, but NO individual balance or weight
      expect(verification.isValid).to.be.true;
      expect(verification.stateRoot).to.not.equal(ethers.ZeroHash);
    });
  });
});
