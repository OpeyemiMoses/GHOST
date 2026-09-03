import { ethers } from "hardhat";

const GHOST_DRAW_ADDRESS = "0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F";
const POLL_INTERVAL_MS = 15000; // Poll every 15 seconds

async function main() {
  console.log("==================================================");
  console.log("   GHOST PROTOCOL · AUTONOMOUS NETWORK KEEPER BOT ");
  console.log("==================================================");

  const [keeperSigner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(`[Keeper] Running on Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`[Keeper] Operator Address: ${keeperSigner.address}`);
  console.log(`[Keeper] Watching GhostDraw Contract: ${GHOST_DRAW_ADDRESS}\n`);

  const GhostDrawFactory = await ethers.getContractFactory("GhostDraw");
  const ghostDraw = GhostDrawFactory.attach(GHOST_DRAW_ADDRESS);

  async function checkAndExecute() {
    try {
      const currentBlock = await ethers.provider.getBlock("latest");
      if (!currentBlock) return;

      const currentTimestamp = currentBlock.timestamp;
      console.log(`[${new Date().toLocaleTimeString()}] Polling block #${currentBlock.number} (Timestamp: ${currentTimestamp})...`);

      // Verify if draw cycle is ready for execution
      try {
        const canExecute = await (ghostDraw as any).canExecute();
        if (canExecute) {
          console.log("\n⚡ [KEEPER TRIGGER] 24-Hour Cycle Threshold Reached! Executing Homomorphic Draw...");
          
          const tx = await (ghostDraw.connect(keeperSigner) as any).executeDraw({
            gasLimit: 600000,
          });
          
          console.log(`🚀 [Keeper] Transaction Broadcasted: ${tx.hash}`);
          console.log("⏳ Waiting for onchain block confirmation...");
          
          const receipt = await tx.wait(1);
          console.log(`✔ [Keeper] Draw Successfully Executed in Block #${receipt?.blockNumber}!`);
          console.log("🎉 Prize Awarded Homomorphically & Next 24-Hour Cycle Initialized.\n");
        } else {
          console.log("⏳ [Keeper] Cycle still active. Timer not yet expired.");
        }
      } catch (checkErr: any) {
        // Fallback for mock/testnet interface
        console.log(`ℹ [Keeper] Status check: ${checkErr.message || 'Standing by'}`);
      }
    } catch (err: any) {
      console.error("❌ [Keeper Error]:", err.message || err);
    }
  }

  // Initial check
  await checkAndExecute();

  // Periodic autonomous polling loop
  console.log(`\n🤖 Autonomous Keeper Service running. Polling every ${POLL_INTERVAL_MS / 1000}s...`);
  setInterval(checkAndExecute, POLL_INTERVAL_MS);
}

main().catch((error) => {
  console.error("Fatal Keeper Error:", error);
  process.exitCode = 1;
});
