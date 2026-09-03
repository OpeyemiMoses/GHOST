# Ghost Public Verification Protocol

## Overview

Ghost's defining principle is:
> **Private state. Public proof.**

A user does not need to expose their financial position for observers to verify that the protocol operated correctly. The `GhostVerifier` contract exposes an independent, permissionless verification endpoint that can be queried by anyone without requiring a Web3 wallet connection.

---

## The Verification Flow

```text
1. Draw Execution
   ├── Generate FHE Randomness (FHE.randEuint64)
   ├── Hash all encrypted participant handles -> stateRoot
   ├── Determine winner confidentially
   └── Commit state to GhostVerifier

2. Third-Party Auditing
   ├── Observer queries verifyDraw(drawId)
   ├── Validates stateRoot and randomnessCommitment
   ├── Validates onchain transaction receipt
   └── Confirms 0 plaintext balance leakage
```

---

## Verification Parameters

When querying `GhostVerifier.verifyDraw(uint256 drawId)`, the contract returns:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `isValid` | `bool` | Boolean flag confirming all protocol invariants were met |
| `stateRoot` | `bytes32` | Cryptographic commitment of all participants' encrypted handles at the draw block |
| `randomnessCommitment` | `bytes32` | Cryptographic commit of Zama onchain FHE randomness |
| `winner` | `address` | Publicly revealed winner address |
| `encryptedPrizeHandle` | `bytes32` | Opaque ciphertext handle of the prize amount (decryptable only by winner) |
| `timestamp` | `uint256` | Block timestamp when the draw was finalized |

---

## Independent Verification via CLI

Auditors can verify any draw directly using `cast` or ethers without accessing Ghost's frontend:

```bash
# Query verification proof directly from Sepolia contract
cast call 0xVERIFIER_ADDRESS "verifyDraw(uint256)" 1 --rpc-url https://rpc.sepolia.org
```

Or using our verification script:

```bash
npx hardhat run scripts/seed-draw.ts --network hardhat
```
