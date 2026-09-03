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
      const currentDrawId = await (ghostDraw as any).currentDrawId();
      const draw = await (ghostDraw as any).getDraw(currentDrawId);

      const endTime = Number(draw.endTime);
      const isExpired = currentTimestamp >= endTime && endTime > 0;
      const isOpen = Number(draw.status) === 1; // DrawStatus.Open = 1

      console.log(
        `[${new Date().toLocaleTimeString()}] Polling Draw #${currentDrawId} | Status: ${draw.status} | End: ${new Date(endTime * 1000).toLocaleTimeString()} | Block Timestamp: ${currentTimestamp}`
      );

      if (isExpired && isOpen) {
        console.log(`\n⚡ [KEEPER TRIGGER] 24-Hour Cycle Threshold Reached for Draw #${currentDrawId}! Executing Homomorphic Draw...`);
        
        const tx = await (ghostDraw.connect(keeperSigner) as any).executeDraw({
          gasLimit: 600000,
        });
        
        console.log(`🚀 [Keeper] Transaction Broadcasted: ${tx.hash}`);
        console.log("⏳ Waiting for onchain block confirmation on Sepolia...");
        
        const receipt = await tx.wait(1);
        console.log(`✔ [Keeper] Draw Successfully Executed in Block #${receipt?.blockNumber}!`);
        console.log(`🎉 Winner Selected Homomorphically & Next 24-Hour Cycle Initialized.\n`);
      } else {
        const remainingSeconds = Math.max(0, endTime - currentTimestamp);
        const remH = Math.floor(remainingSeconds / 3600);
        const remM = Math.floor((remainingSeconds % 3600) / 60);
        const remS = remainingSeconds % 60;
        console.log(`⏳ [Keeper] Cycle active. Next draw in: ${remH}h ${remM}m ${remS}s.`);
      }
    } catch (err: any) {
      console.error("ℹ [Keeper Observation]:", err.message || err);
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
