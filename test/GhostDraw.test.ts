import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostPool, GhostVault, GhostDraw, GhostVerifier, MockConfidentialToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GhostDraw: Confidential Draw Engine & Verification", function () {
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

    // Alice, Bob, and Charlie deposit confidential funds
    await pool.connect(alice).depositPlaintext(10000 * 1e6); // Alice: 10,000 cUSDC
    await pool.connect(bob).depositPlaintext(500 * 1e6);    // Bob: 500 cUSDC
    await pool.connect(charlie).depositPlaintext(2500 * 1e6);// Charlie: 2,500 cUSDC
  });

  describe("Draw Lifecycle", function () {
    it("should open a draw cycle", async function () {
      const tx = await draw.openDraw();
      await tx.wait();

      const currentId = await draw.currentDrawId();
      expect(currentId).to.equal(1n);

      const record = await draw.getDraw(currentId);
      expect(record.drawId).to.equal(1n);
      expect(record.status).to.equal(1); // Open
      expect(record.winner).to.equal(ethers.ZeroAddress);
    });

    it("should execute confidential draw and select a winner from participants", async function () {
      await draw.openDraw();
      const currentId = await draw.currentDrawId();

      const tx = await draw.executeDraw();
      const receipt = await tx.wait();

      const record = await draw.getDraw(currentId);
      expect(record.status).to.equal(3); // Completed
      expect(record.isVerified).to.be.true;

      // Winner must be one of the participants
      const participants = [alice.address, bob.address, charlie.address];
      expect(participants).to.include(record.winner);

      // Randomness commitment and state root must be non-zero
      expect(record.randomnessCommitment).to.not.equal(ethers.ZeroHash);
      expect(record.stateRoot).to.not.equal(ethers.ZeroHash);
      expect(record.encryptedPrizeHandle).to.not.equal(ethers.ZeroHash);

      // Verify GhostVerifier received and validated the draw
      const proof = await verifier.getDrawProof(currentId);
      expect(proof.isVerified).to.be.true;
      expect(proof.winner).to.equal(record.winner);
      expect(proof.randomnessCommitment).to.equal(record.randomnessCommitment);
      expect(proof.stateRoot).to.equal(record.stateRoot);
    });

    it("should allow third-party verification without wallet authentication", async function () {
      await draw.openDraw();
      await draw.executeDraw();

      const currentId = await draw.currentDrawId();

      // Independent caller (zero address or unauthenticated third-party) calls verifyDraw
      const verification = await verifier.verifyDraw(currentId);
      expect(verification.isValid).to.be.true;
      expect(verification.winner).to.not.equal(ethers.ZeroAddress);
      expect(verification.stateRoot).to.not.equal(ethers.ZeroHash);
      expect(verification.randomnessCommitment).to.not.equal(ethers.ZeroHash);
    });
  });
});
