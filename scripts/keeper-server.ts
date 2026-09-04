import http from "http";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const GHOST_DRAW_ADDRESS = "0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F";
const RPC_URL = process.env.SEPOLIA_RPC_URL && !process.env.SEPOLIA_RPC_URL.includes("rpc.sepolia.org")
  ? process.env.SEPOLIA_RPC_URL
  : "https://ethereum-sepolia-rpc.publicnode.com";

const GHOST_DRAW_ABI = [
  "function currentDrawId() view returns (uint256)",
  "function getDraw(uint256 drawId) view returns (tuple(uint256 drawId, uint256 startTime, uint256 endTime, bytes32 encryptedPrizeHandle, address winner, bytes32 randomnessCommitment, bytes32 stateRoot, uint8 status, bool isVerified))",
  "function executeDraw() returns (address winner)"
];

let lastCheckTime = 0;
let latestDrawStatus = "INITIALIZING";
let currentDrawNumber = 0;
let nextDrawInSeconds = 0;

async function runKeeperLoop() {
  console.log("==================================================");
  console.log("   GHOST PROTOCOL · RAILWAY PRODUCTION KEEPER     ");
  console.log("==================================================");
  console.log(`[Keeper] Connecting to Sepolia RPC: ${RPC_URL}`);
  console.log(`[Keeper] Watching GhostDraw: ${GHOST_DRAW_ADDRESS}`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  let signer: ethers.Wallet | null = null;
  const rawKey = process.env.PRIVATE_KEY;
  if (rawKey && rawKey !== "0000000000000000000000000000000000000000000000000000000000000001") {
    try {
      const formattedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
      signer = new ethers.Wallet(formattedKey, provider);
      console.log(`[Keeper] Authenticated Operator Wallet: ${signer.address}`);
    } catch (e: any) {
      console.warn(`[Keeper] Warning: Could not initialize signer from PRIVATE_KEY: ${e.message}`);
    }
  } else {
    console.log("[Keeper] Running in Watcher & Monitoring Mode (No execution private key provided)");
  }

  const ghostDrawContract = new ethers.Contract(GHOST_DRAW_ADDRESS, GHOST_DRAW_ABI, signer || provider);

  async function poll() {
    try {
      lastCheckTime = Date.now();
      const currentBlock = await provider.getBlock("latest");
      if (!currentBlock) return;

      const currentTimestamp = currentBlock.timestamp;
      const drawId = await ghostDrawContract.currentDrawId();
      currentDrawNumber = Number(drawId);
      
      const draw = await ghostDrawContract.getDraw(drawId);
      const endTime = Number(draw.endTime);
      const isOpen = Number(draw.status) === 1; // Open = 1
      const isExpired = currentTimestamp >= endTime && endTime > 0;

      nextDrawInSeconds = Math.max(0, endTime - currentTimestamp);
      const remH = Math.floor(nextDrawInSeconds / 3600);
      const remM = Math.floor((nextDrawInSeconds % 3600) / 60);
      const remS = nextDrawInSeconds % 60;

      latestDrawStatus = isOpen ? (isExpired ? "READY_TO_RESOLVE" : "ACTIVE_COUNTDOWN") : "FINALIZED";

      console.log(
        `[${new Date().toISOString()}] Draw #${currentDrawNumber} | Status: ${latestDrawStatus} | Time Left: ${remH}h ${remM}m ${remS}s`
      );

      if (isExpired && isOpen && signer) {
        console.log(`\n⚡ [KEEPER TRIGGER] 24-Hour Cycle Expired for Draw #${currentDrawNumber}! Executing onchain draw...`);
        const tx = await ghostDrawContract.executeDraw({ gasLimit: 600000 });
        console.log(`🚀 [Keeper] Transaction Broadcasted: ${tx.hash}`);
        const receipt = await tx.wait(1);
        console.log(`✔ [Keeper] Draw Successfully Executed in Block #${receipt?.blockNumber}!\n`);
      }
    } catch (err: any) {
      console.error("[Keeper Error (Recoverable)]:", err.message || err);
    }
  }

  // Initial poll
  await poll();

  // Periodic loop every 15 seconds
  setInterval(poll, 15000);
}

// Start HTTP Healthcheck Server for Railway
const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        service: "ghost-protocol-keeper",
        uptimeSeconds: Math.floor(process.uptime()),
        currentDrawId: currentDrawNumber,
        drawStatus: latestDrawStatus,
        nextDrawInSeconds,
        lastCheckedAt: new Date(lastCheckTime).toISOString(),
        network: "Ethereum Sepolia (11155111)",
        contract: GHOST_DRAW_ADDRESS
      })
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🌐 HTTP Healthcheck Server listening on http://0.0.0.0:${PORT}`);
  runKeeperLoop().catch((err) => {
    console.error("Fatal Keeper Error:", err);
  });
});
