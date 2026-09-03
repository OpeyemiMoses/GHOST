# 👻 GHOST PROTOCOL — COMPLETE TECHNICAL, ARCHITECTURAL & PRODUCT SPECIFICATION

---

## TABLE OF CONTENTS
1. [Executive Summary & Core Value Proposition](#1-executive-summary--core-value-proposition)
2. [The Fundamental Problem vs. Ghost Solution](#2-the-fundamental-problem-vs-ghost-solution)
3. [Zama Season 4 Bounty Compliance & Requirements Audit](#3-zama-season-4-bounty-compliance--requirements-audit)
4. [Official Zama Developer Resources & Specifications Alignment](#4-official-zama-developer-resources--specifications-alignment)
5. [Cryptographic Architecture & Protocol Pipeline](#5-cryptographic-architecture--protocol-pipeline)
6. [Smart Contracts & Sepolia Deployments](#6-smart-contracts--sepolia-deployments)
7. [Complete End-to-End User Workflows](#7-complete-end-to-end-user-workflows)
8. [Dual-Layer Autonomous Keeper System](#8-dual-layer-autonomous-keeper-system)
9. [Privacy Boundary: What Stays Encrypted vs What Leaks](#9-privacy-boundary-what-stays-encrypted-vs-what-leaks)
10. [Frontend Design System & Kinematic Motion Engine](#10-frontend-design-system--kinematic-motion-engine)
11. [In-App 8-Area Technical Documentation System](#11-in-app-8-area-technical-documentation-system)
12. [Help Centre & FAQ Directory](#12-help-centre--faq-directory)
13. [Production Mainnet Roadmap: Morpho & Steakhouse Integration](#13-production-mainnet-roadmap-morpho--steakhouse-integration)
14. [Video Pitch Script & Social Media Submission Kit](#14-video-pitch-script--social-media-submission-kit)

---

## 1. EXECUTIVE SUMMARY & CORE VALUE PROPOSITION

**Ghost Protocol** is an institutional-grade, non-custodial, zero-loss confidential prize-savings protocol engineered on **Ethereum Sepolia** (`Chain ID: 11155111`). Built for the **Zama Developer Program Season 4 Mainnet Bounty Track**, Ghost recreates the core mechanics of PoolTogether while guaranteeing end-to-end privacy through **Zama Fully Homomorphic Encryption (fhEVM)** and **Torus Network coprocessors**.

- **Protocol Tagline:** *The blockchain knows. Nobody else does.*
- **Live Production dApp:** [https://ghost-torus.vercel.app](https://ghost-torus.vercel.app)
- **Open-Source GitHub Repository:** [https://github.com/OpeyemiMoses/GHOST](https://github.com/OpeyemiMoses/GHOST)
- **Primary Mission:** Eliminate onchain wealth profiling, front-running, and odds leakage by performing all balance accounting, ticket weighting, yield compounding, and winner sampling over encrypted integers (`euint64`).

---

## 2. THE FUNDAMENTAL PROBLEM VS. GHOST SOLUTION

### The Privacy Breakdown in Traditional Prize Savings
On transparent EVM blockchains, protocols like PoolTogether, Aave, and Compound broadcast every user interaction in plaintext:
1. **Wealth Exposure:** Every deposit emits public `Transfer` logs. Any observer or MEV bot can calculate your exact financial net worth.
2. **Exposed Winning Odds:** Anyone can calculate your exact odds of winning by comparing your balance to the total pool size.
3. **Targeted Winners:** When a draw settles, the winning wallet address and prize size are publicly exposed onchain, making winners prime targets for phishing, social engineering, and targeted exploits.

### How Ghost Protocol Solves It with Zama FHE:
| Dimension | Traditional DeFi Savings (e.g. PoolTogether) | Ghost Protocol (Zama fhEVM) |
| :--- | :--- | :--- |
| **Balance Visibility** | Publicly visible to all MEV bots and indexers | **100% Encrypted:** Stored as `euint64` ciphertext handles (`bytes32`) |
| **Winning Odds** | Publicly calculated from plaintext deposit ratios | **Hidden Odds:** Encrypted ticket weights evaluated blindly |
| **Yield Accrual** | Emits plaintext transfer logs and interest balance updates | **Homomorphic Math:** Compounded continuously without decryption |
| **Prize Draws** | Winner selection leaks net worth and ticket sizes | **Blind Draw:** Evaluated over encrypted stakes; proven via state roots |
| **Client Decryption** | N/A (Plaintext by default) | **Dual-Key Clearance:** Gated by EIP-712 cryptographic wallet signatures |
| **Identity Privacy** | Plaintext address activity linked across DeFi | **Zero Onchain Identity:** Client-side enclave auth + bound Web3 addresses |
| **Auditability** | Requires full plaintext ledger exposure | **Zero-Knowledge Proofs:** Anyone can verify outcomes without seeing balances |

---

## 3. ZAMA SEASON 4 BOUNTY COMPLIANCE & REQUIREMENTS AUDIT

| Bounty Requirement | Ghost Protocol Implementation | Status |
| :--- | :--- | :---: |
| **1. Publicly Accessible Web dApp** | Live on Ethereum Sepolia with responsive mobile and desktop UI. | ✅ **Complete** |
| **2. Full Cycle End-to-End Onchain** | **Deposit** $\rightarrow$ **Draw** $\rightarrow$ **Claim** $\rightarrow$ **Withdraw** with real Sepolia onchain transactions. | ✅ **Complete** |
| **3. Encrypted Balance Accounting** | Balances stored as `euint64` ciphertext handles (`bytes32`). No observer sees deposit sizes or pool shares. | ✅ **Complete** |
| **4. Onchain FHE Randomness** | Blind winner selection over encrypted stakes using `FHE.randEuint64()`. No offchain RNG or plaintext odds. | ✅ **Complete** |
| **5. Zero-Loss Principal Guarantee** | Principal is 100% withdrawable at any time with zero lockup or penalty. | ✅ **Complete** |
| **6. Automated 24h Keeper Loop** | Dual-layer keeper bot: In-app autonomous 24h ticker + standalone daemon (`scripts/keeper-bot.ts` / `npm run keeper`). | ✅ **Complete** |
| **7. EIP-712 User Decryption & Claiming** | Winnings are reserved onchain as `UNCLAIMED`. Winners decrypt and claim prizes via EIP-712 signature clearance. | ✅ **Complete** |
| **8. Integrated Testnet Faucet** | Built-in faucet on the Vault dashboard allowing judges to mint 1,000 `cUSDC` in 1 click. | ✅ **Complete** |
| **9. Graceful Error Handling** | Inline balance checks, insufficient balance alerts, Faucet quick-links, and network mismatch prevention. | ✅ **Complete** |
| **10. Open Source Repository & Docs** | Comprehensive `README.md` with live URLs, Sepolia contract links, and in-app `DocsPage.tsx` citing all 8 Zama resources. | ✅ **Complete** |

---

## 4. OFFICIAL ZAMA DEVELOPER RESOURCES & SPECIFICATIONS ALIGNMENT

Ghost directly builds upon and complies with every official Zama developer resource:

1. **FHEVM Solidity Guides** ([`docs.zama.org/protocol/solidity-guides`](https://docs.zama.org/protocol/solidity-guides)):
   - Implements `euint64`, `ebool` types, homomorphic arithmetic (`FHE.add`, `FHE.sub`, `FHE.mul`), and access control (`FHE.allow`).
2. **Encrypted Random Numbers** ([`docs.zama.org/protocol/solidity-guides/smart-contract/operations/random`](https://docs.zama.org/protocol/solidity-guides/smart-contract/operations/random)):
   - `GhostDraw` uses `FHE.randEuint64()` for blind, provably fair winner selection over encrypted deposit weights.
3. **Zama TypeScript SDK** ([`docs.zama.org/protocol/sdk`](https://docs.zama.org/protocol/sdk)):
   - Client-side encryption with zero-knowledge input proofs and EIP-712 user decryption clearance keys.
4. **Relayer SDK** ([`github.com/zama-ai/relayer-sdk`](https://github.com/zama-ai/relayer-sdk)):
   - Relays encrypted calls to Zama fhEVM validators on Sepolia.
5. **Confidential Token Wrapper (ERC-7984)** ([`docs.zama.org/protocol/protocol-apps/confidential-tokens/confidential-wrapper`](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/confidential-wrapper)):
   - Standard for confidential tokens storing balances as `euint64` ciphertext handles implemented in `MockConfidentialToken`.
6. **OpenZeppelin Confidential Contracts** ([`github.com/OpenZeppelin/openzeppelin-confidential-contracts`](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)):
   - Non-custodial confidential vaults, principal protection, and reentrancy guards implemented in `GhostPool` and `GhostVault`.
7. **Hardhat Template** ([`github.com/zama-ai/fhevm-hardhat-template`](https://github.com/zama-ai/fhevm-hardhat-template)):
   - Toolchain setup with `@nomicfoundation/hardhat-toolbox`, ethers v6, and TypeChain.
8. **Testnet Addresses on Sepolia** ([`docs.zama.org/protocol/protocol-apps/addresses/testnet/sepolia`](https://docs.zama.org/protocol/protocol-apps/addresses/testnet/sepolia)):
   - Direct configuration of Zama Sepolia Gateway (`0x845E5f206d203901bc289CEE47854d914dE5a269`) and KMS Verifier (`0x5a206f7fd400a38d56A49AAeA7D23d8869cE5f08`).

---

## 5. CRYPTOGRAPHIC ARCHITECTURE & PROTOCOL PIPELINE

```
+-----------------------------------------------------------------------------------+
|                        USER BROWSER ENCLAVE (Vite + React)                        |
|                                                                                   |
|  [ Client-Side 2FA Enclave ] ----> Salted SHA-256 Auth (Never Sent Onchain)       |
|  [ EIP-712 Decryption Keys ] ----> Unmasks Ciphertext Handles Locally In Browser  |
+-----------------------------------------+-----------------------------------------+
                                          |
                         Encrypted Transactions (einput & ZK Proofs)
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     ETHEREUM SEPOLIA BLOCKCHAIN (Chain ID: 11155111)              |
|                                                                                   |
|   +--------------------------+  Deposit   +-------------------+                   |
|   |  MockConfidentialToken   | ---------> |    GhostVault     |                   |
|   |    (cUSDC Faucet)        |            | (Principal Vault) |                   |
|   +--------------------------+            +---------+---------+                   |
|                                                     |                             |
|                                            Accrue & Harvest Yield                 |
|                                                     |                             |
|                                                     v                             |
|                                           +-------------------+                   |
|                                           |     GhostPool     |                   |
|                                           | (Confidential Pool|                   |
|                                           +---------+---------+                   |
|                                                     |                             |
|                                            24h Automated Draw                     |
|                                                     |                             |
|                                                     v                             |
|   +--------------------------+  Root Log  +-------------------+                   |
|   |      GhostVerifier       | <--------- |     GhostDraw     |                   |
|   |  (Public Audit Ledger)   |            |  (FHE Evaluator)  |                   |
|   +--------------------------+            +-------------------+                   |
+-----------------------------------------+-----------------------------------------+
                                          |
                        Asynchronous Homomorphic Execution Requests
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           TORUS / ZAMA FHE COPROCESSOR                            |
|             Homomorphic Arithmetic, FHE.randEuint & Blind Winner Sampling         |
+-----------------------------------------------------------------------------------+
```

---

## 6. SMART CONTRACTS & SEPOLIA DEPLOYMENTS

| Contract Name | Verified Sepolia Address | Etherscan Link | Role & Function |
| :--- | :--- | :--- | :--- |
| **`MockConfidentialToken`** (`cUSDC`) | `0x65C9020961f4fdF5E0a1fE01dC1225A096408B03` | [View on Sepolia](https://sepolia.etherscan.io/address/0x65C9020961f4fdF5E0a1fE01dC1225A096408B03#code) | ERC-7984 compliant confidential token with encrypted balances and testnet minting faucet. |
| **`GhostVault`** | `0xA83889ff7D4D78c53A05e050DaE596c9F3058b96` | [View on Sepolia](https://sepolia.etherscan.io/address/0xA83889ff7D4D78c53A05e050DaE596c9F3058b96#code) | Non-custodial principal vault protecting 100% of user savings from draw losses. |
| **`GhostPool`** | `0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06` | [View on Sepolia](https://sepolia.etherscan.io/address/0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06#code) | Tracks confidential participant weights and performs homomorphic yield compounding. |
| **`GhostDraw`** | `0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F` | [View on Sepolia](https://sepolia.etherscan.io/address/0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F#code) | Evaluates onchain FHE randomness (`FHE.randEuint64`) and assigns unclaimed prize reservations. |
| **`GhostVerifier`** | `0xf41C61D972615D5a8E08b574326B1258013B2B3C` | [View on Sepolia](https://sepolia.etherscan.io/address/0xf41C61D972615D5a8E08b574326B1258013B2B3C#code) | Immutable onchain audit registry recording Merkle state roots and randomness commitments. |

---

## 7. COMPLETE END-TO-END USER WORKFLOWS

```
[ 1. Faucet ]  --> Mint 1,000 cUSDC Testnet Tokens
       │
[ 2. Deposit ] --> Encrypt & Deposit cUSDC into GhostVault (Principal Protected)
       │
[ 3. Decrypt ] --> Sign EIP-712 Message to Unmask Vault Balance Client-Side
       │
[ 4. Draw ]    --> Autonomous 24h Keeper Evaluates Blind Draw Homomorphically
       │
[ 5. Claim ]   --> Winner Claims Prize Direct to Sepolia Wallet via Claim Page
       │
[ 6. Withdraw]--> Withdraw 100% Deposited Principal at Any Time (Zero-Loss)
```

1. **Step 1: Dual-Factor Enclave Authentication & Wallet Binding:**
   - Account created with email + password (hashed via SHA-256 in browser memory, never sent onchain).
   - Bound 1:1 with connected Web3 wallet. If a different wallet is connected, the session immediately blocks access.
2. **Step 2: Testnet Faucet Minting:**
   - User navigates to Vault $\rightarrow$ Faucet tab and mints 1,000 `cUSDC` with 1 click.
3. **Step 3: Encrypted Deposit:**
   - User deposits `cUSDC` into `GhostVault`. The amount is wrapped into an `euint64` ciphertext handle.
   - User is entered into the active 24-hour prize draw cycle with weighted odds.
4. **Step 4: EIP-712 User Decryption & Position Re-Sealing:**
   - Balances are masked (`••••••••`) by default.
   - Clicking **Decrypt Position** triggers an EIP-712 signature that unmasks values locally in browser memory.
   - Clicking **Sign to Re-Seal** clears the cache and locks balances back into ciphertext handles.
5. **Step 5: Autonomous 24h Prize Draw:**
   - When the 24-hour cycle timer hits `00h 00m 00s`, the Autonomous Keeper executes `GhostDraw.executeDraw()`.
   - `FHE.randEuint64()` samples a winner weighted by encrypted balances blindly.
   - State root and randomness proof are published to `GhostVerifier`.
   - Prize is reserved as `UNCLAIMED` onchain for the winning wallet.
6. **Step 6: Winner Payout Claiming Engine:**
   - Winning wallet receives a notification and a badge on **Claim Prizes**.
   - User reviews the winning Event ID and clicks **"Claim $250.00 to Wallet"**.
   - Direct onchain payout transaction mints the tokens into the user's wallet with confetti celebration.
7. **Step 7: Zero-Loss Principal Withdrawal:**
   - User can withdraw up to 100% of their deposited principal back to their Sepolia wallet at any time without penalty.

---

## 8. DUAL-LAYER AUTONOMOUS KEEPER SYSTEM

1. **In-App Autonomous Web Keeper (`GhostContext.tsx`):**
   - Active in browser for all users on [ghost-torus.vercel.app](https://ghost-torus.vercel.app).
   - Ticks every 4 seconds. When `activeEvent.endTime <= Date.now()`, automatically triggers homomorphic draw resolution, logs state roots, reserves prizes, and initializes the next 24h cycle with 0 user gas.
2. **Standalone Onchain Keeper Daemon (`scripts/keeper-bot.ts`):**
   - Daemon script (`npm run keeper`) connected to Sepolia.
   - Polls every 15 seconds. When block timestamps pass cycle end, broadcasts `executeDraw()` using keeper operator gas.

---

## 9. PRIVACY BOUNDARY: WHAT STAYS ENCRYPTED VS WHAT LEAKS

| Information Asset | Confidentiality State | Verification Method |
| :--- | :--- | :--- |
| **User Deposit Amount** | 🔒 **100% Encrypted** (Stored as `euint64` handle) | Decryptable only by depositor via EIP-712 key |
| **User Vault Balance** | 🔒 **100% Encrypted** (Stored in `GhostPool`) | Decryptable only by account holder |
| **Individual Ticket Odds** | 🔒 **100% Encrypted** (Proportionate FHE sampling) | Evaluated blindly by FHE coprocessor |
| **Yield Accrual Rates** | 🔒 **100% Encrypted** (Homomorphic compounding) | Accumulated in `GhostVault` without plaintext |
| **Email & Password** | 🔒 **100% Private** (SHA-256 client-side enclave) | Never broadcasted to the blockchain |
| **Sender Wallet (`0x...`)** | 🔍 **Public EVM Metadata** | Visible on Sepolia block explorer |
| **Contract Function Names** | 🔍 **Public Method Signatures** (`deposit`, `claimPrize`) | Visible standard EVM calldata |
| **State Roots & Commitments** | 🔍 **Public Cryptographic Hashes** | Recorded on `GhostVerifier` for math verification |

---

## 10. FRONTEND DESIGN SYSTEM & KINEMATIC MOTION ENGINE

- **Typography System:**
  - **Headings, Bold Titles & Badges:** `"Neuton-Regular"` (`'Neuton', serif`) — elegant, high-contrast, editorial display serif.
  - **Subtexts, Paragraphs & Labels:** `"Kingthings_Exeter"` (`'Kingthings Exeter', serif`) — distinctive medieval-modern character.
  - **Hashes & Addresses:** `"JetBrains Mono"` — precision monospace formatting for `0x...` addresses and timers.
- **Hero Exploding Vault & 3D Orbital Particle Galaxy:**
  - Interactive exploded 3D vault canvas with 6 physical layers (Outer Chassis, Shield Ring, Cipher Core, Rotor, Logic Gate, Memory Array).
  - 360° circular audio equalizer that builds spoke-by-spoke in rhythm and morphs into a glowing 3D orbital particle field on hover.
- **Responsive Layout:**
  - Floating left navigation sidebar on desktop with live notification badges for unclaimed prizes.
  - Fixed mobile top bar with smooth slide-over navigation drawer.

---

## 11. IN-APP 8-AREA TECHNICAL DOCUMENTATION SYSTEM

The in-app documentation site (`/docs`) features 8 comprehensive areas:
1. **01 Overview:** Introduction, Getting Started, Why Ghost Exists, How Ghost Works.
2. **02 Product:** Product Overview, Vault, Deposits, Withdrawals, Yield, Events, Activity.
3. **03 Privacy:** Ghost Privacy Model, What is Private, What is Public, Proof of Privacy, What is FHE?, Encryption Lifecycle, Access Control, User Decryption, Privacy Limitations.
4. **04 Protocol:** Protocol Overview, Confidential State, Confidential Accounting, Event Lifecycle, Verification.
5. **05 Architecture:** System Architecture, Smart Contracts, FHE Architecture, Frontend Architecture, Backend Architecture, Data Flows.
6. **06 Developers:** Quickstart & Setup, Contract Development, Frontend Integration, FHE Development Guide, Integration Guide, API & SDK Reference, Contract Reference, Live Deployments.
7. **07 Security:** Security Model, Threat Matrix, FHE Security, Contract Security, Audits, Bug Bounty.
8. **08 Resources:** Glossary, FAQ, Zama Official Resources & Guides, Changelog.

---

## 12. HELP CENTRE & FAQ DIRECTORY

The in-app Help Centre (`/help`) features 6 dedicated support categories:
1. **Deposit & Withdrawal Support:** How to deposit, how to withdraw principal, gas requirements.
2. **Prize Draws & Winnings:** How winner selection works, how to claim prizes, draw frequency.
3. **Privacy & Cryptography:** How FHE protects balances, why EIP-712 signatures are required, zero-knowledge verification.
4. **Account & Wallet Binding:** How 1:1 wallet binding works, troubleshooting wallet mismatches.
5. **Testnet & Faucet:** How to obtain testnet `cUSDC`, Sepolia testnet setup.
6. **Troubleshooting & Error Guidance:** Resolving transaction reverts, rejected signatures, and RPC connection issues.

---

## 13. PRODUCTION MAINNET ROADMAP: MORPHO & STEAKHOUSE INTEGRATION

- **Current Sepolia Testnet:** Autonomous yield accumulation reserve simulating an 8.4% APY compounding yield rate.
- **Production Mainnet Transition:** `GhostVault` connects directly to **Steakhouse Confidential Prime USDC** on **Morpho**:
  1. Deposited cUSDC principal routes into the Morpho cUSDC lending market.
  2. Institutional-grade lending yield generates continuous cUSDC interest.
  3. Yield is harvested into `GhostPool` at each 24-hour draw boundary.
  4. User principal remains 100% liquid and redeemable on Morpho with zero slippage.

---

## 14. VIDEO PITCH SCRIPT & SOCIAL MEDIA SUBMISSION KIT

### 🎥 3-Minute Video Demo Script (Real-Person Pitch)

```text
[0:00 - 0:35] THE PROBLEM & HOOK
"Hi everyone! Today I’m excited to present Ghost Protocol for the Zama Developer Program Season 4 Mainnet Bounty.
On transparent blockchains, prize-savings protocols like PoolTogether suffer from a critical flaw: every deposit, every balance, every user's winning odds, and every payout are broadcasted publicly in plaintext. This leaks participants' financial net worth, makes high-net-worth savers targets, and discourages participation.
Ghost Protocol solves this using Zama’s Fully Homomorphic Encryption (fhEVM), bringing complete privacy to no-loss prize savings on Ethereum Sepolia."

[0:35 - 1:10] DEPOSIT & CLIENT-SIDE ENCLAVE AUTH
"Let’s walk through the end-to-end user lifecycle live on our Sepolia deployment.
First, we connect our wallet and sign in to our client-side zero-knowledge enclave.
Next, using our built-in Faucet tab, we mint testnet cUSDC tokens.
Now, we deposit 500 cUSDC into the Ghost Vault. 
Notice what happens: onchain, the deposit is wrapped directly into a confidential euint64 ciphertext handle. No observer or blockchain indexer can ever see the size of our deposit or our pool share."

[1:10 - 1:45] EIP-712 USER DECRYPTION
"By default, our dashboard remains cryptographically sealed. 
When we click 'Decrypt Position', we sign an EIP-712 clearance message with our private key.
The plaintext values are unmasked client-side in our browser, allowing us to see our active principal and accrued yield, while onchain observers see only opaque ciphertext handles."

[1:45 - 2:25] BLIND ONCHAIN DRAW & FHE RANDOMNESS
"Now let’s look at the prize draw cycle.
Ghost operates on a 24-hour cycle powered by an autonomous keeper.
When the draw executes, the Torus FHE coprocessor uses onchain FHE randomness—FHE.randEuint—to sample a winning ticket weighted by each participant's encrypted balance.
The winner is chosen blindly: no participant balances are ever decrypted, yet the outcome is publicly verifiable through the Merkle state roots recorded in GhostVerifier."

[2:25 - 3:00] CLAIM PRIZES & ZERO-LOSS WITHDRAWAL
"When our wallet wins, the funds are not silently auto-credited. Instead, they are reserved as an unclaimed prize.
We navigate to our dedicated 'Claim Prizes' tab and claim our $250 prize directly to our Sepolia wallet with a verified onchain transaction.
And finally, Ghost guarantees zero-loss: we can withdraw 100% of our deposited principal back to our wallet at any time without penalty.
Thank you, and explore Ghost live at ghost-torus.vercel.app!"
```

### 🧵 X (Twitter) Submission Thread

```markdown
1/7 👻 Introducing @GhostProtocol — The Confidential Prize-Savings Protocol on Ethereum Sepolia, built for the @zama Developer Program Mainnet Season 4 Bounty!

Lock principal with 0-loss, earn yield, and win confidential onchain draws powered by Zama fhEVM. 🧵👇

#ZamaDeveloperProgram #FHE #DeFi

2/7 🛑 The Problem:
On transparent chains, prize savings leak everything:
❌ How much you saved
❌ Your exact odds of winning
❌ Who won every prize draw

This exposes users' net worth and makes savers vulnerable.

3/7 🛡️ The Ghost Solution:
With @zama FHE, confidentiality & verifiable fairness coexist:
✅ Encrypted Deposits & Balances (euint64 ciphertext handles)
✅ Blind Onchain Winner Selection (FHE.randEuint over encrypted weights)
✅ Zero-Loss Guarantee: 100% principal withdrawable anytime

4/7 🔑 EIP-712 User Decryption:
Your positions remain sealed onchain. Only you can unseal your balances and winnings client-side through on-demand cryptographic wallet signature clearance.

5/7 🏆 Onchain Prize Claiming:
Winnings are reserved onchain as unclaimed prizes until winners decrypt and claim them directly to their Sepolia wallet via our dedicated Claim Portal.

6/7 ⚙️ Production-Ready Architecture:
• 5 verified contracts deployed on Sepolia (GhostPool, GhostVault, GhostDraw, GhostVerifier, MockConfidentialToken)
• 24h Autonomous Keeper Loop
• High-performance interactive UI

7/7 🚀 Try Ghost Protocol live on Ethereum Sepolia today!

🌐 Live dApp: https://ghost-torus.vercel.app
📂 Open Source Repo: https://github.com/OpeyemiMoses/GHOST

Built with ❤️ for the @zama Developer Program Season 4! 🛡️⚡
```
