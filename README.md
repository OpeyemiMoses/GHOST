<div align="center">
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
4. [Dual-Factor Auth & 1:1 Wallet Binding](#dual-factor-auth--11-wallet-binding)
5. [Architecture & Pipeline](#architecture--pipeline)
6. [Smart Contracts & Sepolia Deployments](#smart-contracts--sepolia-deployments)
7. [Privacy & Security Model](#privacy--security-model)
8. [MVP User Walkthrough](#mvp-user-walkthrough)
9. [What Ghost Sees vs. What Ghost Never Sees](#what-ghost-sees-vs-what-ghost-never-sees)
10. [Local Development & Setup](#local-development--setup)
11. [Environment Configuration (.env.example)](#environment-configuration-envexample)
12. [Testing & Deployment](#testing--deployment)
13. [Zero-Knowledge Verification](#zero-knowledge-verification)
14. [Roadmap](#roadmap)
15. [Contributing & License](#contributing--license)

---

## Overview

**Ghost Protocol** is an institution-grade, non-custodial confidential prize-savings protocol built on **Ethereum Sepolia**. Traditional DeFi savings pools expose all balances, deposit amounts, and transaction histories publicly in plaintext ERC-20 transfer logs.

Ghost eliminates this privacy vulnerability by performing all balance accounting, yield compounding, and prize distributions **homomorphically over encrypted integers (`euint64`)** using Zama fhEVM and Torus Network coprocessors.

Depositors benefit from a **zero-loss guarantee**: 100% of your initial deposited principal remains securely in the vault, while collective confidential yield is directed toward periodic, verifiable, zero-knowledge prize distributions.

---

## The Problem vs. Ghost Solution

| Dimension | Traditional DeFi Savings (e.g. PoolTogether, Aave) | Ghost Confidential Protocol |
| :--- | :--- | :--- |
| **Balance Visibility** | Publicly visible to all MEV bots, searchers, and blockchain indexers. | **100% Encrypted:** Stored as `euint64` ciphertext handles. |
| **Yield Accrual** | Yield events emit plaintext transfer logs onchain. | **Homomorphic Math:** Compounded continuously without decryption. |
| **Prize Draws** | Winner selection leaks net worth and participant tickets. | **Blind Draw:** Evaluated over encrypted stakes; proven via state roots. |
| **Client Decryption** | N/A (Plaintext by default). | **Dual-Key Clearance:** Gated by on-demand cryptographic wallet signatures. |
| **Identity Privacy** | Plaintext address activity linked across DeFi ecosystems. | **Zero Onchain Identity:** Client-side enclave auth + bound Web3 addresses. |
| **Auditability** | Requires full plaintext ledger exposure. | **Zero-Knowledge Proofs:** Anyone can verify outcomes without seeing balances. |

---

## Key Features

- **Total Onchain Privacy:** Balances are sealed in `euint64` ciphertext handles on Sepolia.
- **Zero-Loss Guarantee:** You can withdraw 100% of your principal at any time without penalty.
- **Continuous Compounding Yield:** Automated homomorphic interest accumulation computed over encrypted values.
- **Dual-Factor Account Authentication & 1:1 Wallet Binding:**
  - Client-side SHA-256 salted password hashing (Zero onchain leakage).
  - Permanent 1:1 binding between email accounts and Ethereum wallet addresses.
  - Strict address enforcement: Signature requests revert on unauthorized wallets.
- **Kinematic Motion Engine:**
  - Rich physical rise-in blur-pop animations on every route transition.
  - Container-aware scroll reveal engine with smooth dynamic focus.
- **Mobile-First Responsive Interface:**
  - Mobile top app bar with slide-over navigation sheet.
  - Touch-friendly documentation area switcher and adaptive single-page viewports.
- **Address-Isolated Confidential Ledger:** Activity history and balances are strictly scoped per connected wallet.
- **Testnet Confidential Faucet:** Built-in faucet to mint testnet confidential cUSDC directly on Sepolia.
- **Verifiable Outcome State Roots:** Cryptographic randomness commitments and Merkle roots prove prize draw integrity.

---

## Dual-Factor Auth & 1:1 Wallet Binding

Ghost introduces a modern **Zero-Knowledge Client-Side Authentication Enclave**:

```
+--------------------------------------------------------------------------+
|                  Client-Side Cryptographic Auth Enclave                  |
|                                                                          |
|  [ User Email & Password ] ---> Salted SHA-256 Hash ---> Local Storage   |
|                                (Never Sent Onchain)                      |
|                                                                          |
|  [ Connected Web3 Wallet ] ---> Bound 1:1 to Email Account (EIP-712 Sig) |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|                        Gated Dashboard Entry Gate                        |
|                                                                          |
|  1. Verify Email & Password Hash                                         |
|  2. Check Connected Address == Bound Address (0x8F4c...3e1A)             |
|  3. Request Ephemeral Session Signature (ghost_session_v1)                |
|  4. Unseal Confidential Balances Client-Side                              |
+--------------------------------------------------------------------------+
```

1. **Email Authentication:** Email and password hashes reside purely in browser memory and local storage enclaves—the blockchain never knows an email address exists.
2. **1:1 Strict Wallet Binding:** On first sign-in, the user connects and permanently locks their Web3 address to that email profile.
3. **Mismatch Prevention:** Connecting a different wallet triggers an instant block (*"Wallet Mismatch Detected"*), preventing unauthorized session unsealing.

---

## Architecture & Pipeline

```
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
```

---

## Smart Contracts & Sepolia Deployments

All contracts are verified and deployed on **Ethereum Sepolia** (`Chain ID: 11155111`):

| Contract | Verified Sepolia Address | Description |
| :--- | :--- | :--- |
| **`MockConfidentialToken`** (`cUSDC`) | [`0x65C9020961f4fdF5E0a1fE01dC1225A096408B03`](https://sepolia.etherscan.io/address/0x65C9020961f4fdF5E0a1fE01dC1225A096408B03) | Confidential ERC-20 test token with mintable faucet and encrypted balances. |
| **`GhostVault`** | [`0xA83889ff7D4D78c53A05e050DaE596c9F3058b96`](https://sepolia.etherscan.io/address/0xA83889ff7D4D78c53A05e050DaE596c9F3058b96) | Non-custodial vault holding encrypted principal deposits. |
| **`GhostPool`** | [`0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06`](https://sepolia.etherscan.io/address/0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06) | Homomorphic yield pooling and savings rate compounding engine. |
| **`GhostDraw`** | [`0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F`](https://sepolia.etherscan.io/address/0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F) | Verifiable FHE randomness evaluator and prize dispatcher. |

---

## Privacy & Security Model

- **No Plaintext In Logs:** Zero balance or transaction values are emitted in Ethereum transaction logs.
- **Client-Side Key Possession:** Decryption tickets and email credentials are never sent to a centralized server.
- **Cryptographic Re-Sealing:** When locked, browser memory purges decrypted caches and presents only ciphertext indicators (`••••••••`).
- **Cryptographic Signatures:** Every access grant requires an on-demand wallet signature (`ghost_session_v1`) from the bound wallet address.

---

## MVP User Walkthrough

1. **Sign In or Create Account:** Open the **Connect Gateway**, enter your email and set a password.
2. **Bind Your Web3 Wallet:** Connect MetaMask or Rainbow and click **"Lock & Bind Wallet to Account"**.
3. **Authorize Session:** Sign the cryptographic session clearance message to enter your confidential dashboard.
4. **Claim Faucet Tokens:** In the **Vault** page, switch to the **Faucet** tab and mint 1,000 testnet `cUSDC`.
5. **Deposit to Vault:** Enter your deposit amount and confirm. Principal is encrypted into `GhostVault`.
6. **Earn Yield & Prize Tickets:** Your deposit automatically earns continuous savings yield and enters active prize draw cycles.
7. **Decrypt / Re-Seal Balances:** Click **Decrypt Balance** or **Sign to Lock & Encrypt** to toggle between plaintext and sealed ciphertext.
8. **Execute Draws:** On the **Events** page, execute the onchain draw when the countdown finishes.
9. **Verify Outcomes:** Navigate to **Verify** to inspect Merkle state roots and randomness commitments.

---

## What Ghost Sees vs. What Ghost Never Sees

Ghost is architected on a zero-knowledge, zero-leakage security boundary:

| Data Point | What Ghost & The Public Blockchain Sees | What Ghost NEVER Sees |
| :--- | :--- | :--- |
| **User Email & Password** | Never visible (stored strictly in client enclave) | **Only You (Private client-side storage)** |
| **Account Balance** | Never visible onchain (stored as `euint64` ciphertext handle) | **Only You (Decrypted client-side via wallet signature)** |
| **Deposit & Withdraw Amounts** | Never emitted in plaintext logs or transaction inputs | **Only You (Encrypted into FHE ciphertexts)** |
| **Yield Accrual Rates** | Never calculated in plaintext | **Evaluated homomorphically by Torus FHE coprocessor** |
| **Prize Allocation Value** | Never exposed in plaintext event emissions | **Sealed in ciphertext until winner decrypts** |
| **Connected Wallet Address** | Visible as transaction sender (`0x...`) | — |
| **Transaction Gas & Timestamps** | Visible standard EVM execution metadata | — |
| **Contract Function Names** | Visible method invocations (`deposit`, `withdraw`, `executeDraw`) | — |
| **State Roots & Random Commitments** | Visible cryptographic hashes for public auditability | — |

---

## Local Development & Setup

### Prerequisites

- **Node.js:** `v18.0.0` or higher
- **npm:** `v9.0.0` or higher
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/OpeyemiMoses/GHOST.git
cd GHOST

# Install root dependencies
npm install

# Install web app dependencies
cd apps/web
npm install
cd ../..
```

### 2. Configure Environment Variables

Create your local `.env` file in the root directory:

```bash
cp .env.example .env
```

### 3. Launch Development Server

```bash
cd apps/web
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Configuration (.env.example)

Below is the complete reference for required environment variables in `.env`:

```ini
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
```

---

## Testing & Deployment

```bash
# Compile Hardhat contracts
npx hardhat compile

# Run Hardhat test suite
npx hardhat test

# Deploy contracts to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Seed testnet draw data
npx hardhat run scripts/seed-draw.ts --network sepolia
```

---

## Zero-Knowledge Verification

Ghost guarantees auditability without sacrificing confidentiality:

1. **Deterministic Merkle Roots:** Every state transition computes a Merkle root over the set of ciphertext handles.
2. **Randomness Proofs:** Torus FHE coprocessors publish a randomness commit hash alongside each winner selection.
3. **Public Explorer Audit:** Anyone can audit transaction hashes and state commitments on [Sepolia Etherscan](https://sepolia.etherscan.io/) without wallet authentication.

---

## Roadmap

- [x] **Phase 1: Cryptographic Foundation** - Zama fhEVM integration and `euint64` confidential token.
- [x] **Phase 2: Vault & Pool Smart Contracts** - Zero-loss vault and continuous homomorphic compounding.
- [x] **Phase 3: Verifiable FHE Draw Engine** - Torus randomness evaluator and prize dispatcher.
- [x] **Phase 4: Sepolia Testnet Deployment** - Full contract deployment on Sepolia (Chain ID `11155111`).
- [x] **Phase 5: Web Application** - High-aesthetic React frontend with cryptographic session authorization.
- [x] **Phase 6: Dual-Factor Auth & Wallet Binding** - Client-side SHA-256 account enclave + 1:1 Web3 address binding.
- [x] **Phase 7: Mobile Responsiveness & Motion Engine** - Adaptive viewport sheets, touch area selectors, and rise-in blur-pop physics.
- [ ] **Phase 8: Multi-Asset Expansion** - Confidential vault pools for cETH, cWBTC, and liquid staking tokens.
- [ ] **Phase 9: Mainnet Formal Audit & Launch** - Production formal verification.

---

## Contributing & License

We welcome community contributions! Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Security Policy

For vulnerability reports, please consult [SECURITY.md](SECURITY.md).

### License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
