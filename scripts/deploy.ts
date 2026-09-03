import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("==================================================");
  console.log("   GHOST: CONFIDENTIAL PRIZE-SAVINGS PROTOCOL    ");
  console.log("   Deploying to network:", (await ethers.provider.getNetwork()).name);
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy MockConfidentialToken (cUSDC)
  console.log("\n1. Deploying MockConfidentialToken (cUSDC)...");
  const Token = await ethers.getContractFactory("MockConfidentialToken");
  const token = await Token.deploy("Confidential USDC", "cUSDC", 6);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✔ MockConfidentialToken deployed at:", tokenAddress);

  // 2. Deploy GhostVerifier
  console.log("\n2. Deploying GhostVerifier...");
  const Verifier = await ethers.getContractFactory("GhostVerifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✔ GhostVerifier deployed at:", verifierAddress);

  // 3. Deploy GhostVault
  console.log("\n3. Deploying GhostVault...");
  const Vault = await ethers.getContractFactory("GhostVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✔ GhostVault deployed at:", vaultAddress);

  // 4. Deploy GhostPool
  console.log("\n4. Deploying GhostPool...");
  const Pool = await ethers.getContractFactory("GhostPool");
  const pool = await Pool.deploy(tokenAddress);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("✔ GhostPool deployed at:", poolAddress);

  // 5. Deploy GhostDraw
  console.log("\n5. Deploying GhostDraw...");
  const Draw = await ethers.getContractFactory("GhostDraw");
  const draw = await Draw.deploy(poolAddress, vaultAddress, verifierAddress);
  await draw.waitForDeployment();
  const drawAddress = await draw.getAddress();
  console.log("✔ GhostDraw deployed at:", drawAddress);

  // 6. Connect Protocol Permissions
  console.log("\n6. Configuring Protocol Cross-Contract Permissions...");
  const tx1 = await pool.setProtocolContracts(vaultAddress, drawAddress);
  await tx1.wait(1);
  console.log("✔ Linked GhostPool permissions");
  
  const tx2 = await vault.setProtocolAddresses(poolAddress, drawAddress);
  await tx2.wait(1);
  console.log("✔ Linked GhostVault permissions");
  
  const tx3 = await verifier.setDrawContract(drawAddress);
  await tx3.wait(1);
  console.log("✔ Linked GhostVerifier permissions");
  console.log("✔ Cross-contract authorizations linked successfully.");

  // Save deployment artifact
  const deploymentData = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    contracts: {
      MockConfidentialToken: tokenAddress,
      GhostVerifier: verifierAddress,
      GhostVault: vaultAddress,
      GhostPool: poolAddress,
      GhostDraw: drawAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentPath = path.join(deploymentsDir, "sepolia.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
  console.log("\n✔ Deployment summary saved to:", deploymentPath);

  console.log("\n==================================================");
  console.log("   GHOST PROTOCOL DEPLOYMENT COMPLETE             ");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
