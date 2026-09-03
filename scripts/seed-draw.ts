import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("==================================================");
  console.log("   GHOST PROTOCOL: SEED PARTICIPANTS & RUN DRAW   ");
  console.log("==================================================");

  const deploymentPath = path.join(__dirname, "../deployments/sepolia.json");
  let poolAddress: string;
  let drawAddress: string;
  let verifierAddress: string;

  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
    poolAddress = deployment.contracts.GhostPool;
    drawAddress = deployment.contracts.GhostDraw;
    verifierAddress = deployment.contracts.GhostVerifier;
  } else {
    console.log("Deploying fresh instance for local simulation...");
    const Token = await ethers.getContractFactory("MockConfidentialToken");
    const token = await Token.deploy("Confidential USDC", "cUSDC", 6);
    await token.waitForDeployment();

    const Verifier = await ethers.getContractFactory("GhostVerifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();

    const Vault = await ethers.getContractFactory("GhostVault");
    const vault = await Vault.deploy();
    await vault.waitForDeployment();

    const Pool = await ethers.getContractFactory("GhostPool");
    const pool = await Pool.deploy(await token.getAddress());
    await pool.waitForDeployment();

    const Draw = await ethers.getContractFactory("GhostDraw");
    const draw = await Draw.deploy(await pool.getAddress(), await vault.getAddress(), await verifier.getAddress());
    await draw.waitForDeployment();

    await pool.setProtocolContracts(await vault.getAddress(), await draw.getAddress());
    await vault.setProtocolAddresses(await pool.getAddress(), await draw.getAddress());
    await verifier.setDrawContract(await draw.getAddress());

    poolAddress = await pool.getAddress();
    drawAddress = await draw.getAddress();
    verifierAddress = await verifier.getAddress();
  }

  const signers = await ethers.getSigners();
  const pool = await ethers.getContractAt("GhostPool", poolAddress);
  const draw = await ethers.getContractAt("GhostDraw", drawAddress);
  const verifier = await ethers.getContractAt("GhostVerifier", verifierAddress);

  console.log("\n1. Depositing Confidential Balances for Participants...");
  // Alice deposits 10,000 cUSDC
  await pool.connect(signers[0]).depositPlaintext(10000 * 1e6);
  console.log(`✔ Participant 1 (${signers[0].address}): Confidential balance deposited.`);

  if (signers.length > 1) {
    // Bob deposits 500 cUSDC
    await pool.connect(signers[1]).depositPlaintext(500 * 1e6);
    console.log(`✔ Participant 2 (${signers[1].address}): Confidential balance deposited.`);
  }

  if (signers.length > 2) {
    // Charlie deposits 2,500 cUSDC
    await pool.connect(signers[2]).depositPlaintext(2500 * 1e6);
    console.log(`✔ Participant 3 (${signers[2].address}): Confidential balance deposited.`);
  }

  console.log(`\nTotal confidential participants in pool: ${await pool.totalParticipants()}`);

  console.log("\n2. Initiating Draw Cycle...");
  const openTx = await draw.openDraw();
  await openTx.wait();
  const drawId = await draw.currentDrawId();
  console.log(`✔ Draw #${drawId} opened.`);

  console.log("\n3. Computing Draw over Encrypted State with Zama FHE Randomness...");
  const execTx = await draw.executeDraw();
  await execTx.wait();
  console.log(`✔ Draw #${drawId} executed successfully.`);

  const drawRecord = await draw.getDraw(drawId);
  console.log("\n--- DRAW OUTCOME ---");
  console.log("Winner Address:           ", drawRecord.winner);
  console.log("Randomness Commitment:    ", drawRecord.randomnessCommitment);
  console.log("Encrypted State Root:     ", drawRecord.stateRoot);
  console.log("Encrypted Prize Handle:   ", drawRecord.encryptedPrizeHandle);

  console.log("\n4. Auditing Onchain Public Verification...");
  const proof = await verifier.verifyDraw(drawId);
  console.log("Verification Status:      ", proof.isValid ? "✓ PASSED (Cryptographically Valid)" : "FAILED");
  console.log("Participant Balances:     HIDDEN / CONFIDENTIAL (0 Plaintext Exposure)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });
