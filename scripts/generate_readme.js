const fs = require("fs");

const content = `<div align="center">
  <img src="apps/web/public/assets/ghost-logo-lockup-white.png" alt="Ghost Protocol" width="400" />

  <p><strong>Confidential Zero-Loss Prize-Savings Protocol on Ethereum Sepolia</strong></p>
  <p>Powered by Torus Network Coprocessors & Zama fhEVM Homomorphic Computing</p>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    <a href="https://sepolia.etherscan.io/"><img src="https://img.shields.io/badge/Network-Sepolia%20Testnet-8C52FF" alt="Network: Sepolia"></a>
    <a href="https://zama.ai/fhevm"><img src="https://img.shields.io/badge/Cryptography-Zama%20fhEVM-111111" alt="FHE: Zama"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF" alt="Frontend: Vite"></a>
    <a href="https://github.com/OpeyemiMoses/GHOST/actions"><img src="https://img.shields.io/badge/Build-Passing-10B981" alt="Build Status"></a>
  </p>
</div>

---

## Table of Contents

1. [Overview](#overview)
2. [The Problem vs. Ghost Solution](#the-problem-vs-ghost-solution)
3. [Key Features](#key-features)
4. [Architecture & Pipeline](#architecture--pipeline)
5. [Smart Contracts & Sepolia Deployments](#smart-contracts--sepolia-deployments)
6. [Privacy & Security Model](#privacy--security-model)
7. [MVP User Walkthrough](#mvp-user-walkthrough)
8. [Local Development & Setup](#local-development--setup)
9. [Environment Configuration (.env.example)](#environment-configuration-envexample)
10. [Testing & Deployment](#testing--deployment)
11. [Zero-Knowledge Verification](#zero-knowledge-verification)
12. [Roadmap](#roadmap)
13. [Contributing & License](#contributing--license)

---

## Overview

**Ghost Protocol** is an institution-grade, non-custodial confidential prize-savings protocol built on **Ethereum Sepolia**. Traditional DeFi savings pools expose all balances, deposit amounts, and transaction histories publicly in plaintext ERC-20 transfer logs.

Ghost eliminates this privacy vulnerability by performing all balance accounting, yield compounding, and prize distributions **homomorphically over encrypted integers (\`euint64\`)** using Zama fhEVM and Torus Network coprocessors.

Depositors benefit from a **zero-loss guarantee**: 100% of your initial deposited principal remains securely in the vault, while collective confidential yield is directed toward periodic, verifiable, zero-knowledge prize distributions.

---

## The Problem vs. Ghost Solution

| Dimension | Traditional DeFi Savings (e.g. PoolTogether, Aave) | Ghost Confidential Protocol |
| :--- | :--- | :--- |
| **Balance Visibility** | Publicly visible to all MEV bots, searchers, and blockchain indexers. | **100% Encrypted:** Stored as \`euint64\` ciphertext handles. |
| **Yield Accrual** | Yield events emit plaintext transfer logs onchain. | **Homomorphic Math:** Compounded continuously without decryption. |
| **Prize Draws** | Winner selection leaks net worth and participant tickets. | **Blind Draw:** Evaluated over encrypted stakes; proven via state roots. |
| **Client Decryption** | N/A (Plaintext by default). | **Wallet Clearance:** Gated by on-demand cryptographic wallet signature. |
| **Auditability** | Requires full plaintext ledger exposure. | **Zero-Knowledge Proofs:** Anyone can verify outcomes without seeing balances. |

---

## Key Features

- **Total Onchain Privacy:** Balances are sealed in \`euint64\` ciphertext handles on Sepolia.
- **Zero-Loss Guarantee:** You can withdraw 100% of your principal at any time without penalty.
- **Continuous Compounding Yield:** Automated homomorphic interest accumulation computed over encrypted values.
- **Dual-Key Wallet Clearance Flow:**
  - **Decryption:** Prompts wallet to sign an on-demand decryption clearance message to unmask balances client-side.
  - **Re-Sealing / Locking:** Prompts wallet to sign a re-sealing request, immediately masking balances to \`••••••••\`.
- **Address-Isolated Confidential Ledger:** Activity history and balances are strictly scoped per connected wallet.
- **Testnet Confidential Faucet:** Built-in faucet to mint testnet confidential cUSDC directly on Sepolia.
- **Verifiable Outcome State Roots:** Cryptographic randomness commitments and Merkle roots prove prize draw integrity.

---

## Architecture & Pipeline

\`\`\`
+-------------------------------------------------------------------------+
|                       User Web Client (Vite + React)                    |
|   Plaintext view ONLY with active wallet session cryptographic signature|
+------------------------------------+------------------------------------+
                                     |
                        Encrypted Transaction (einput)
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      Ethereum Sepolia Blockchain                        |
|                                                                         |
|   +---------------------+   +---------------------+   +-------------+   |
|   | MockConfidentialToken   |      GhostVault     |   |  GhostPool  |   |
|   |   (cUSDC Faucet)    |-->|  (Principal Vault)  |-->| (Yield Pool)|   |
|   +---------------------+   +---------------------+   +------+------+   |
|                                                              |          |
|                                     Trigger Prize Draw       |          |
|                                                              v          |
|                             +---------------------------------------+   |
|                             |               GhostDraw               |   |
|                             |      (Verifiable FHE Evaluator)       |   |
|                             +-------------------+-------------------+   |
|                                                 |                       |
|                                Commit Root & Proofs                     |
|                                                 v                       |
|                             +---------------------------------------+   |
|                             |             GhostVerifier             |   |
|                             |     (Public Onchain Auditability)     |   |
|                             +---------------------------------------+   |
+------------------------------------+------------------------------------+
                                     |
                   Asynchronous FHE Execution Requests
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      Torus / Zama FHE Coprocessor                       |
|        Homomorphic Arithmetic & Blind Random Winner Computation         |
+-------------------------------------------------------------------------+
\`\`\`

---

## Smart Contracts & Sepolia Deployments

All contracts are verified and deployed on **Ethereum Sepolia** (\`Chain ID: 11155111\`):

| Contract | Verified Sepolia Address | Description |
| :--- | :--- | :--- |
| **\`MockConfidentialToken\`** (\`cUSDC\`) | [\`0x65C9020961f4fdF5E0a1fE01dC1225A096408B03\`](https://sepolia.etherscan.io/address/0x65C9020961f4fdF5E0a1fE01dC1225A096408B03) | Confidential ERC-20 test token with mintable faucet and encrypted balances. |
| **\`GhostVault\`** | [\`0xA83889ff7D4D78c53A05e050DaE596c9F3058b96\`](https://sepolia.etherscan.io/address/0xA83889ff7D4D78c53A05e050DaE596c9F3058b96) | Non-custodial vault holding encrypted principal deposits. |
| **\`GhostPool\`** | [\`0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06\`](https://sepolia.etherscan.io/address/0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06) | Homomorphic yield pooling and savings rate compounding engine. |
| **\`GhostDraw\`** | [\`0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F\`](https://sepolia.etherscan.io/address/0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F) | Verifiable FHE randomness evaluator and prize dispatcher. |

---

## Privacy & Security Model

- **No Plaintext In Logs:** Zero balance or transaction values are emitted in Ethereum transaction logs.
- **Client-Side Key Possession:** Decryption tickets are never sent to a centralized server.
- **Cryptographic Re-Sealing:** When locked, browser memory purges decrypted caches and presents only ciphertext indicators (\`••••••••\`).
- **Cryptographic Signatures:** Every access grant requires an EIP-712 / \`signMessage\` authorization from the connected wallet.

---

## MVP User Walkthrough

1. **Connect Wallet:** Connect MetaMask, Rainbow, or Coinbase Wallet and sign the session clearance message.
2. **Claim Faucet Tokens:** In the **Vault** page, switch to the **Faucet** tab and mint 1,000 testnet \`cUSDC\`.
3. **Deposit to Vault:** Enter your deposit amount and confirm. Principal is encrypted into \`GhostVault\`.
4. **Earn Yield & Prize Tickets:** Your deposit automatically earns continuous savings yield and enters active prize draw cycles.
5. **Decrypt / Re-Seal Balances:** Click **Decrypt Balance** or **Sign to Lock & Encrypt** to toggle between plaintext and sealed ciphertext.
6. **Execute Draws:** On the **Events** page, execute the onchain draw when the countdown finishes.
7. **Verify Outcomes:** Navigate to **Verify** to inspect Merkle state roots and randomness commitments.

---

## Local Development & Setup

### Prerequisites

- **Node.js:** \`v18.0.0\` or higher
- **npm:** \`v9.0.0\` or higher
- **Git**

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/OpeyemiMoses/GHOST.git
cd GHOST

# Install root dependencies
npm install

# Install web app dependencies
cd apps/web
npm install
cd ../..
\`\`\`

### 2. Configure Environment Variables

Create your local \`.env\` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Launch Development Server

\`\`\`bash
cd apps/web
npm run dev
\`\`\`

The app will be available at \`http://localhost:5173\`.

---

## Environment Configuration (.env.example)

Below is the complete reference for required environment variables in \`.env\`:

\`\`\`ini
# =================================================================
# NETWORK & RPC CONFIGURATION
# =================================================================
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
ETHERSCAN_API_KEY=""

# =================================================================
# DEPLOYER PRIVATE KEY (For running Hardhat deployment scripts)
# =================================================================
PRIVATE_KEY="0x0000000000000000000000000000000000000000000000000000000000000001"

# =================================================================
# ZAMA fhEVM INFRASTRUCTURE
# =================================================================
ZAMA_SEPOLIA_RPC="https://rpc.sepolia.zama.ai"
ZAMA_GATEWAY_SEPOLIA="https://gateway.sepolia.zama.ai"

# =================================================================
# DEPLOYED SMART CONTRACT ADDRESSES (SEPOLIA CHAIN ID: 11155111)
# =================================================================
VITE_TOKEN_ADDRESS="0x65C9020961f4fdF5E0a1fE01dC1225A096408B03"
VITE_VAULT_ADDRESS="0xA83889ff7D4D78c53A05e050DaE596c9F3058b96"
VITE_POOL_ADDRESS="0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06"
VITE_DRAW_ADDRESS="0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F"
\`\`\`

---

## Testing & Deployment

\`\`\`bash
# Compile Hardhat contracts
npx hardhat compile

# Run Hardhat test suite
npx hardhat test

# Deploy contracts to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Seed testnet draw data
npx hardhat run scripts/seed-draw.ts --network sepolia
\`\`\`

---

## Zero-Knowledge Verification

Ghost guarantees auditability without sacrificing confidentiality:

1. **Deterministic Merkle Roots:** Every state transition computes a Merkle root over the set of ciphertext handles.
2. **Randomness Proofs:** Torus FHE coprocessors publish a randomness commit hash alongside each winner selection.
3. **Public Explorer Audit:** Anyone can audit transaction hashes and state commitments on [Sepolia Etherscan](https://sepolia.etherscan.io/) without wallet authentication.

---

## Roadmap

- [x] **Phase 1: Cryptographic Foundation** - Zama fhEVM integration and \`euint64\` confidential token.
- [x] **Phase 2: Vault & Pool Smart Contracts** - Zero-loss vault and continuous homomorphic compounding.
- [x] **Phase 3: Verifiable FHE Draw Engine** - Torus randomness evaluator and prize dispatcher.
- [x] **Phase 4: Sepolia Testnet Deployment** - Full contract deployment on Sepolia (Chain ID \`11155111\`).
- [x] **Phase 5: Web Application** - High-aesthetic React frontend with cryptographic session authorization.
- [ ] **Phase 6: Multi-Asset Expansion** - Confidential vault pools for cETH, cWBTC, and liquid staking tokens.
- [ ] **Phase 7: Mainnet Audit & Launch** - Formal verification and mainnet production deployment.

---

## Contributing & License

We welcome community contributions! Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Security Policy

For vulnerability reports, please consult [SECURITY.md](SECURITY.md).

### License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
`;

fs.writeFileSync("README.md", content, "utf8");
console.log("README written cleanly with exact linebreaks!");
