import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const recipient = "0xb4825abd70312e52083ddb55d3a00c0c309a6c09";
  const rawKey = process.env.PRIVATE_KEY?.trim() || "";
  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Sender wallet:", wallet.address);
  console.log("Sending 1.0 Sepolia ETH to:", recipient);

  const tx = await wallet.sendTransaction({
    to: recipient,
    value: ethers.parseEther("1.0"),
  });
  console.log("Transaction Hash:", tx.hash);
  const receipt = await tx.wait(1);
  console.log("✔ Successfully confirmed in Sepolia block:", receipt?.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Funding error:", err);
    process.exit(1);
  });
