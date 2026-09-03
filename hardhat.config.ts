import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL && !process.env.SEPOLIA_RPC_URL.includes("rpc.sepolia.org") 
  ? process.env.SEPOLIA_RPC_URL 
  : "https://ethereum-sepolia-rpc.publicnode.com";
const rawKey = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000001";
const PRIVATE_KEY = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    zamaSepolia: {
      url: process.env.ZAMA_SEPOLIA_RPC || "https://rpc.sepolia.zama.ai",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
