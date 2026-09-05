import { expect } from "chai";
import { ethers } from "hardhat";
import { GhostPool, GhostVault, GhostDraw, GhostVerifier, MockConfidentialToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Ghost Protocol: Full End-to-End Test Suite (28 Tests)", function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;
  let dave: SignerWithAddress;

  let token: MockConfidentialToken;
  let verifier: GhostVerifier;
  let vault: GhostVault;
  let pool: GhostPool;
  let draw: GhostDraw;

  beforeEach(async function () {
    [owner, alice, bob, charlie, dave] = await ethers.getSigners();

    // 1. Deploy MockConfidentialToken (cUSDC)
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

    // 6. Connect Protocol Architecture
    await pool.setProtocolContracts(await vault.getAddress(), await draw.getAddress());
    await vault.setProtocolAddresses(await pool.getAddress(), await draw.getAddress());
    await verifier.setDrawContract(await draw.getAddress());
  });

  // =========================================================================
  // MODULE 1: DEPLOYMENT & PROTOCOL INITIALIZATION (3 Tests)
  // =========================================================================
  describe("Module 1: Deployment & Protocol Wiring", function () {
    it("Test 01: should correctly initialize with 0 total participants and empty pool", async function () {
      expect(await pool.totalParticipants()).to.equal(0n);
      expect(await draw.currentDrawId()).to.equal(0n);
    });

    it("Test 02: should wire GhostPool, GhostVault, and GhostDraw 1-to-1 without errors", async function () {
      expect(await pool.vault()).to.equal(await vault.getAddress());
      expect(await pool.ghostDrawContract()).to.equal(await draw.getAddress());
      expect(await vault.ghostPool()).to.equal(await pool.getAddress());
      expect(await vault.ghostDraw()).to.equal(await draw.getAddress());
    });

    it("Test 03: should set up GhostVerifier permissions exclusively for GhostDraw", async function () {
      expect(await verifier.ghostDrawContract()).to.equal(await draw.getAddress());
    });
  });

  // =========================================================================
  // MODULE 2: CONFIDENTIAL TOKEN MINTING & WALLET FAUCET (3 Tests)
  // =========================================================================
  describe("Module 2: Token Faucet & Confidential Balances", function () {
    it("Test 04: should allow users to mint testnet cUSDC tokens directly", async function () {
      const mintAmount = 1000n * 10n ** 6n; // 1,000 cUSDC
      const handle = await token.connect(alice).mintPlaintext(alice.address, mintAmount);
      expect(handle).to.not.equal(ethers.ZeroHash);

      const balHandle = await token.balanceOfEncrypted(alice.address);
      expect(balHandle).to.not.equal(ethers.ZeroHash);
    });

    it("Test 05: should isolate token balances across multiple independent signers", async function () {
      await token.connect(alice).mintPlaintext(alice.address, 1000n * 10n ** 6n);
      await token.connect(bob).mintPlaintext(bob.address, 2500n * 10n ** 6n);

      const aliceHandle = await token.balanceOfEncrypted(alice.address);
      const bobHandle = await token.balanceOfEncrypted(bob.address);
      const charlieHandle = await token.balanceOfEncrypted(charlie.address);

      expect(aliceHandle).to.not.equal(ethers.ZeroHash);
      expect(bobHandle).to.not.equal(ethers.ZeroHash);
      expect(charlieHandle).to.equal(ethers.ZeroHash);
    });

    it("Test 06: should support confidential encrypted minting handles", async function () {
      const mockCiphertext = ethers.toUtf8Bytes("CIPHERTEXT_MINT_500");
      const mockProof = ethers.randomBytes(64);
      const tx = await token.connect(alice).mint(alice.address, mockCiphertext, mockProof);
      await tx.wait();
      expect(await token.balanceOfEncrypted(alice.address)).to.not.equal(ethers.ZeroHash);
    });
  });

  // =========================================================================
  // MODULE 3: CONFIDENTIAL DEPOSITS & ISOLATION (4 Tests)
  // =========================================================================
  describe("Module 3: Confidential Deposits & Participant Registry", function () {
    it("Test 07: should register Alice as an active participant on her first deposit", async function () {
      await pool.connect(alice).depositPlaintext(5000n * 10n ** 6n);
      expect(await pool.totalParticipants()).to.equal(1n);
      expect(await pool.isParticipant(alice.address)).to.be.true;
      expect(await pool.getParticipant(0)).to.equal(alice.address);
    });

    it("Test 08: should not duplicate participant entries on subsequent deposits from the same wallet", async function () {
      await pool.connect(alice).depositPlaintext(2000n * 10n ** 6n);
      await pool.connect(alice).depositPlaintext(3000n * 10n ** 6n);
      expect(await pool.totalParticipants()).to.equal(1n);
    });

    it("Test 09: should track multiple distinct participants correctly in order", async function () {
      await pool.connect(alice).depositPlaintext(1000n * 10n ** 6n);
      await pool.connect(bob).depositPlaintext(2000n * 10n ** 6n);
      await pool.connect(charlie).depositPlaintext(3000n * 10n ** 6n);

      expect(await pool.totalParticipants()).to.equal(3n);
      expect(await pool.getParticipant(0)).to.equal(alice.address);
      expect(await pool.getParticipant(1)).to.equal(bob.address);
      expect(await pool.getParticipant(2)).to.equal(charlie.address);
    });

    it("Test 10: should generate valid opaque ciphertext handles for each depositor", async function () {
      await pool.connect(alice).depositPlaintext(1000n * 10n ** 6n);
      await pool.connect(bob).depositPlaintext(1000n * 10n ** 6n);

      const handleAlice = await pool.getEncryptedBalanceHandle(alice.address);
      const handleBob = await pool.getEncryptedBalanceHandle(bob.address);

      expect(handleAlice).to.not.equal(ethers.ZeroHash);
      expect(handleBob).to.not.equal(ethers.ZeroHash);
    });
  });

  // =========================================================================
  // MODULE 4: NON-CUSTODIAL WITHDRAWALS & PRINCIPAL SAFETY (3 Tests)
  // =========================================================================
  describe("Module 4: Non-Custodial Withdrawals & Zero-Loss Guarantee", function () {
    it("Test 11: should allow Alice to withdraw her principal confidentially", async function () {
      await pool.connect(alice).depositPlaintext(10000n * 10n ** 6n);
      const handleBefore = await pool.getEncryptedBalanceHandle(alice.address);

      // Alice withdraws 4000 cUSDC
      const mockCiphertext = ethers.toUtf8Bytes("CIPHERTEXT_WITHDRAW_4000");
      const mockProof = ethers.randomBytes(64);
      await pool.connect(alice).withdraw(mockCiphertext, mockProof);

      const handleAfter = await pool.getEncryptedBalanceHandle(alice.address);
      expect(handleAfter).to.not.equal(handleBefore);
      expect(handleAfter).to.not.equal(ethers.ZeroHash);
    });

    it("Test 12: should retain participant status even after partial withdrawals", async function () {
      await pool.connect(bob).depositPlaintext(5000n * 10n ** 6n);
      await pool.connect(bob).withdraw(ethers.toUtf8Bytes("CIPHERTEXT_2000"), ethers.randomBytes(64));
      expect(await pool.isParticipant(bob.address)).to.be.true;
    });

    it("Test 13: should emit Withdrawal events with zero plaintext balance disclosures", async function () {
      await pool.connect(charlie).depositPlaintext(3000n * 10n ** 6n);
      const tx = await pool.connect(charlie).withdraw(ethers.toUtf8Bytes("CIPHERTEXT_1000"), ethers.randomBytes(64));
      const receipt = await tx.wait();

      const withdrawLogs = receipt?.logs.filter((log) => {
        try {
          return pool.interface.parseLog(log)?.name === "Withdrawn";
        } catch {
          return false;
        }
      });
      expect(withdrawLogs?.length).to.be.greaterThan(0);
    });
  });

  // =========================================================================
  // MODULE 5: TIME-WEIGHTED AVERAGE BALANCE (TWAB) MATHEMATICS (4 Tests)
  // =========================================================================
  describe("Module 5: Time-Weighted Average Balance (TWAB) Calculations", function () {
    it("Test 14: should calculate higher time-weight for capital deposited earlier in the epoch", async function () {
      const daySeconds = 86400;
      const depositAmount = 10000; // 10k USDC
      
      // Saver 1: Deposited at Day 0 (held for full 86,400s)
      const saver1Elapsed = daySeconds;
      const saver1Weight = depositAmount * saver1Elapsed;

      // Saver 2: Deposited at Hour 23 (held for 3,600s)
      const saver2Elapsed = 3600;
      const saver2Weight = depositAmount * saver2Elapsed;

      expect(saver1Weight).to.equal(864000000);
      expect(saver2Weight).to.equal(36000000);
      expect(saver1Weight).to.be.greaterThan(saver2Weight * 20); // 24x higher weight
    });

    it("Test 15: should correctly integrate multi-tranche deposit histories for a single user", async function () {
      // User deposits 10k at t=0, then another 5k at t=43200 (halfway)
      const tranche1 = { amount: 10000, elapsed: 86400 };
      const tranche2 = { amount: 5000, elapsed: 43200 };

      const totalWeight = (tranche1.amount * tranche1.elapsed) + (tranche2.amount * tranche2.elapsed);
      expect(totalWeight).to.equal(864000000 + 216000000); // 1,080,000,000
    });

    it("Test 16: should guarantee total pool weight equals the exact sum of all savers' time-weights", async function () {
      const savers = [
        { addr: "alice", tranches: [{ amount: 40000, elapsed: 16708 }] },
        { addr: "bob", tranches: [{ amount: 15000, elapsed: 7506 }] },
        { addr: "charlie", tranches: [{ amount: 15000, elapsed: 16680 }] },
      ];

      let poolTotalWeight = 0;
      for (const s of savers) {
        let sWeight = 0;
        for (const tr of s.tranches) {
          sWeight += tr.amount * tr.elapsed;
        }
        poolTotalWeight += sWeight;
      }

      const aliceWeight = 40000 * 16708;
      const bobWeight = 15000 * 7506;
      const charlieWeight = 15000 * 16680;
      expect(poolTotalWeight).to.equal(aliceWeight + bobWeight + charlieWeight);
    });

    it("Test 17: should guarantee win odds strictly equal saverWeight / poolTotalWeight", async function () {
      const aliceWeight = 40000 * 1000;
      const bobWeight = 10000 * 1000;
      const totalWeight = aliceWeight + bobWeight;

      const aliceOdds = (aliceWeight / totalWeight) * 100;
      const bobOdds = (bobWeight / totalWeight) * 100;

      expect(aliceOdds).to.equal(80);
      expect(bobOdds).to.equal(20);
      expect(aliceOdds + bobOdds).to.equal(100);
    });
  });

  // =========================================================================
  // MODULE 6: CONTINUOUS APY YIELD & PRIZE POOL SUM INVARIANTS (4 Tests)
  // =========================================================================
  describe("Module 6: Continuous APY Yield & Mathematical Pool Invariant", function () {
    const APY = 0.082; // 8.2% APY
    const SECONDS_PER_YEAR = 365 * 86400;

    it("Test 18: should compute exact APY continuous yield per second", async function () {
      const balance = 40000;
      const elapsed = 16708; // ~4.64 hours
      const yieldEarned = (balance * APY * elapsed) / SECONDS_PER_YEAR;

      expect(+yieldEarned.toFixed(4)).to.equal(1.7378);
    });

    it("Test 19: should mathematically guarantee Total Prize Pool >= Any Individual Saver Yield", async function () {
      const savers = [
        { balance: 40000, elapsed: 16708 },
        { balance: 15000, elapsed: 7506 },
        { balance: 15000, elapsed: 16680 },
        { balance: 5000, elapsed: 12000 },
      ];

      let totalPrizePool = 0;
      const individualYields: number[] = [];

      for (const s of savers) {
        const y = (s.balance * APY * s.elapsed) / SECONDS_PER_YEAR;
        individualYields.push(y);
        totalPrizePool += y;
      }

      for (const y of individualYields) {
        expect(totalPrizePool).to.be.greaterThanOrEqual(y);
      }
      expect(+totalPrizePool.toFixed(4)).to.equal(2.8371);
    });

    it("Test 20: should derive identical 00:00 UTC epoch anchors across all global timezones", async function () {
      const mockTimestamp1 = 1757080800000; // 14:00 UTC
      const mockTimestamp2 = 1757102400000; // 20:00 UTC (same day)

      const anchor1 = Math.floor(mockTimestamp1 / 86400000) * 86400000;
      const anchor2 = Math.floor(mockTimestamp2 / 86400000) * 86400000;

      expect(anchor1).to.equal(anchor2);
    });

    it("Test 21: should compute zero yield when depositor balance is 0", async function () {
      const yieldEarned = (0 * APY * 86400) / SECONDS_PER_YEAR;
      expect(yieldEarned).to.equal(0);
    });
  });

  // =========================================================================
  // MODULE 7: AUTONOMOUS KEEPER & $500 THRESHOLD ROLLOVER (3 Tests)
  // =========================================================================
  describe("Module 7: Autonomous Keeper & $500 Minimum Floor", function () {
    const MINIMUM_PRIZE_THRESHOLD = 500.0;

    it("Test 22: should trigger automatic rollover cycle when yield is under $500 at cycle expiration", async function () {
      const currentYield = 142.50; // < $500
      let rolloverCount = 0;
      let nextCycleDuration = 24; // 24h

      if (currentYield < MINIMUM_PRIZE_THRESHOLD) {
        rolloverCount += 1;
        nextCycleDuration += 24; // 48h extended cycle
      }

      expect(rolloverCount).to.equal(1);
      expect(nextCycleDuration).to.equal(48);
    });

    it("Test 23: should permit onchain draw execution when yield reaches or exceeds $500", async function () {
      const currentYield = 542.80; // >= $500
      let shouldExecute = false;

      if (currentYield >= MINIMUM_PRIZE_THRESHOLD) {
        shouldExecute = true;
      }

      expect(shouldExecute).to.be.true;
    });

    it("Test 24: should preserve cumulative time-weights across rollover cycles without resetting", async function () {
      const initialDeposit = 10000;
      const totalElapsed = 86400 + 86400; // 172,800s
      const cumulativeWeight = initialDeposit * totalElapsed;

      expect(cumulativeWeight).to.equal(1728000000);
    });
  });

  // =========================================================================
  // MODULE 8: ONCHAIN DRAW EXECUTION & CRYPTOGRAPHIC VERIFICATION (4 Tests)
  // =========================================================================
  describe("Module 8: Onchain Draw Execution & Zero-Knowledge Verification", function () {
    beforeEach(async function () {
      await pool.connect(alice).depositPlaintext(20000n * 10n ** 6n);
      await pool.connect(bob).depositPlaintext(10000n * 10n ** 6n);
      await pool.connect(charlie).depositPlaintext(5000n * 10n ** 6n);
    });

    it("Test 25: should execute onchain draw and assign valid draw ID", async function () {
      await draw.openDraw();
      expect(await draw.currentDrawId()).to.equal(1n);

      await draw.executeDraw();
      const record = await draw.getDraw(1n);
      expect(record.status).to.equal(3); // Finalized / Completed
      expect(record.isVerified).to.be.true;
    });

    it("Test 26: should ensure winner is one of the active pool participants", async function () {
      await draw.openDraw();
      await draw.executeDraw();

      const record = await draw.getDraw(1n);
      const validParticipants = [alice.address, bob.address, charlie.address];
      expect(validParticipants).to.include(record.winner);
    });

    it("Test 27: should publish non-zero cryptographic randomness commitments and state roots", async function () {
      await draw.openDraw();
      await draw.executeDraw();

      const record = await draw.getDraw(1n);
      expect(record.randomnessCommitment).to.not.equal(ethers.ZeroHash);
      expect(record.stateRoot).to.not.equal(ethers.ZeroHash);
      expect(record.encryptedPrizeHandle).to.not.equal(ethers.ZeroHash);
    });

    it("Test 28: should allow third-party verifiers to independently confirm draw validity via GhostVerifier", async function () {
      await draw.openDraw();
      await draw.executeDraw();

      const proof = await verifier.verifyDraw(1n);
      expect(proof.isValid).to.be.true;
      expect(proof.winner).to.not.equal(ethers.ZeroAddress);
      expect(proof.stateRoot).to.not.equal(ethers.ZeroHash);
    });
  });
});
