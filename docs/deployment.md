# Ghost Sepolia Deployment Guide

## Overview

Ghost smart contracts are engineered for **Ethereum Sepolia** testnet with **Zama fhEVM** coprocessor support.

---

## Prerequisites

1. **Sepolia ETH**: Obtain testnet ETH from a Sepolia faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com/)).
2. **Sepolia RPC URL**: An Infura, Alchemy, or public Sepolia endpoint.
3. **Private Key**: An Ethereum account with Sepolia ETH for gas.
4. **Node.js**: v20+ and npm.

---

## Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Populate the following variables:

```ini
SEPOLIA_RPC_URL="https://rpc.sepolia.org"
PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY_OPTIONAL"
ZAMA_GATEWAY_SEPOLIA="https://gateway.sepolia.zama.ai"
```

---

## Deployment Instructions

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Run Test Suite
Before deploying, ensure all unit, draw, and privacy tests pass:
```bash
npm test
```

### 3. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

The script will deploy:
1. `MockConfidentialToken` (cUSDC)
2. `GhostVerifier`
3. `GhostVault`
4. `GhostPool`
5. `GhostDraw`

Cross-contract permissions will be configured automatically, and the resulting contract addresses will be saved to `deployments/sepolia.json`.

---

## Seeding & Running a Test Draw on Sepolia

To fund participants, trigger a confidential draw, and verify the outcome:

```bash
npx hardhat run scripts/seed-draw.ts --network sepolia
```
