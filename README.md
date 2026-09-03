# Ghost 👻

## Confidential Prize-Savings Protocol powered by Zama FHE

> **The blockchain knows. Nobody else does.**  
> **Private money. Verifiable outcomes.**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636.svg)](https://soliditylang.org/)
[![Zama fhEVM](https://img.shields.io/badge/Zama-fhEVM%20Sepolia-yellow.svg)](https://docs.zama.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Executive Summary

**Ghost** is a confidential prize-savings protocol engineered for the **Zama Developer Program Season 4** bounty challenge.

In traditional onchain prize-savings protocols (such as PoolTogether), financial transparency is absolute: every wallet address, deposit size, account balance, ticket weight, win probability, and reward distribution is visible to any observer watching the blockchain.

**Ghost transforms this paradigm using Zama Fully Homomorphic Encryption (FHE):**
- Users deposit assets into a shared yield-generating pool where individual balances, deposit sizes, and ticket weights remain encrypted (`euint64`).
- Prize draws execute homomorphically over encrypted state using onchain Zama FHE randomness (`FHE.randEuint64()`).
- The protocol determines the winner and awards confidential prizes without exposing any participant's balance.
- **Only the winner** is granted cryptographic authorization (`FHE.allow`) to decrypt the prize.
- Anyone can independently audit and verify draw outcomes through `GhostVerifier` without needing a wallet connection.

> **Ghost lets the blockchain verify what happened without revealing users' financial positions.**

---

## 2. Core Architecture

```text
                       GHOST CLIENT / AUDITOR
                              │
                              ▼
                     Wallet Connection (Sepolia)
                              │
                              ▼
                     Client-Side Encryption
                     (Zama SDK + ZK Proof)
                              │
                              ▼
                  ┌────────────────────────┐
                  │    GHOST CONTRACTS     │
                  │                        │
                  │ GhostPool.sol          │
                  │ ├── Encrypted balances │
                  │ ├── Homomorphic add/sub│
                  │ └── Zama ACL permissions
                  │                        │
                  │ GhostVault.sol         │
                  │ ├── Encrypted yield    │
                  │ └── Prize pool harvest │
                  │                        │
                  │ GhostDraw.sol          │
                  │ ├── FHE Randomness     │
                  │ ├── Confidential winner│
                  │ └── State root commit  │
                  │                        │
                  │ GhostVerifier.sol      │
                  │ ├── Public commitments │
                  │ └── Zero-auth audits   │
                  └───────────┬────────────┘
                              │
                              ▼
                       ZAMA fhEVM LAYER
                              │
                              ▼
                   Homomorphic Computation
                Enc(balance) + Enc(yield)
                              │
                              ▼
                  Encrypted Winner & Prize
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
         Winner Only View            Public Verifier View
        (Zama KMS Decrypt)          (Commitment & Proof Audit)
```

### Protocol Contracts

1. **`GhostPool.sol`**:
   - Manages encrypted user balances using Zama's `euint64` type.
   - Accepts confidential deposits via `deposit(bytes encryptedAmount, bytes proof)`.
   - Supports confidential withdrawals via `withdraw(bytes encryptedAmount, bytes proof)`.
   - Sets viewing permissions via `FHE.allow(balance, msg.sender)`.
   - **Zero Plaintext Principle**: Emits strictly opaque 32-byte ciphertext handles in event logs—never plaintext financial numbers.
2. **`GhostVault.sol`**:
   - Accrues yield into an encrypted prize pool (`euint64 private _encryptedPrizePool`).
   - Transfers accumulated prizes to `GhostDraw` for periodic distribution.
3. **`GhostDraw.sol`**:
   - Manages the confidential draw lifecycle.
   - Generates cryptographically secure onchain randomness with Zama's `FHE.randEuint64()`.
   - Computes state roots over all encrypted participant handles.
   - Selects the winner without decrypting participant balances.
   - Credits the prize to the winner in `GhostPool`, ensuring **only the winner** can decrypt their prize.
4. **`GhostVerifier.sol`**:
   - Stores immutable onchain cryptographic commitments for each draw: `stateRoot`, `randomnessCommitment`, `winnerAddress`, `encryptedPrizeHandle`, `timestamp`.
   - Exposes `verifyDraw(uint256 drawId)` for third-party auditing with zero wallet connection required.
5. **`MockConfidentialToken.sol`**:
   - Confidential ERC20 token (cUSDC) with Zama FHE encryption support for local testing and Sepolia deployment.

---

## 3. The 3-Layer Privacy Model

| Layer | Protected State | Visibility |
| :--- | :--- | :--- |
| **Layer 1: Balance Privacy** | Deposit amount, balance, prize amount | **Encrypted (`euint64`)**. Only authorized user can decrypt via Zama KMS. |
| **Layer 2: Computation Privacy** | Participant odds, ticket weights, winner selection | **Homomorphic FHE**. Calculations occur over ciphertexts without decryption. |
| **Layer 3: Metadata Transparency** | Wallet address, tx hash, gas, public draw commitment | **Public onchain metadata**. Allows universal auditability without leaking financial state. |

---

## 4. Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/ghost.git
cd ghost

# Install dependencies
npm install --legacy-peer-deps
```

### Compile Smart Contracts
```bash
npm run compile
```

### Run Tests
```bash
# Run all tests (unit tests, draw tests, and privacy audit)
npm test

# Run dedicated Privacy Integrity test (asserts 0 plaintext balance leakage)
npm run test:privacy
```

### Local Simulation & Draw Execution
```bash
# Simulates deposits for Alice, Bob, and Charlie, executes an FHE draw, and verifies outcomes
npx hardhat run scripts/seed-draw.ts
```

---

## 5. Sepolia Deployment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your `SEPOLIA_RPC_URL` and `PRIVATE_KEY`.
3. Deploy to Ethereum Sepolia:
   ```bash
   npm run deploy:sepolia
   ```

Deployment addresses and artifacts will be generated in `deployments/sepolia.json`.

---

## 6. Verification & Auditing

Anyone can verify any executed draw directly on the contract without connecting a wallet:

```bash
# Using cast / CLI
cast call <GHOST_VERIFIER_ADDRESS> "verifyDraw(uint256)" 1 --rpc-url https://rpc.sepolia.org
```

---

## 7. Documentation Index

- [Architecture Guide](docs/architecture.md)
- [3-Layer Privacy Model](docs/privacy-model.md)
- [Security Threat Model](docs/threat-model.md)
- [Public Verification Protocol](docs/verification.md)
- [Sepolia Deployment Guide](docs/deployment.md)

---

## 8. License

MIT License. Built for the Zama Developer Program Season 4 Bounty.
