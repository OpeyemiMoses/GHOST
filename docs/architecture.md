# Ghost Protocol Architecture

## Overview

Ghost is a confidential prize-savings protocol engineered with **Zama Fully Homomorphic Encryption (FHE)**. Users deposit assets into a shared yield-generating pool while their balances, positions, ticket weights, and individual winnings remain encrypted onchain.

The protocol separates **Financial Privacy** from **Public Verifiability**:
- Sensitive financial data remains encrypted under Zama FHE.
- Protocol computations execute homomorphically over encrypted state.
- Outcomes and draw commitments remain publicly verifiable onchain.

---

## High-Level System Architecture

```text
                       GHOST CLIENT / UI
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
                  │ ├── Deposited / Withdrawn
                  │ └── ACL Authorization  │
                  │                        │
                  │ GhostVault.sol         │
                  │ ├── Yield accrual      │
                  │ └── Encrypted prize    │
                  │                        │
                  │ GhostDraw.sol          │
                  │ ├── FHE Randomness     │
                  │ ├── Confidential winner│
                  │ └── State root commit  │
                  │                        │
                  │ GhostVerifier.sol      │
                  │ ├── Proof commitments  │
                  │ └── Public audits      │
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

---

## Smart Contract Roles & Boundaries

### 1. `GhostPool.sol`
- **Responsibility**: Manages confidential user deposits, encrypted balances, and withdrawals.
- **State**:
  - `mapping(address => euint64) private _encryptedBalances;`
  - Array of participant addresses (addresses are public metadata; balances are private).
- **Key Operations**:
  - `deposit(bytes encryptedAmount, bytes proof)`: Converts verified input ciphertext to `euint64`, homomorphically adds to user balance, grants user decryption permissions (`FHE.allow`), triggers vault yield accrual.
  - `withdraw(bytes encryptedAmount, bytes proof)`: Homomorphically subtracts from user balance and emits opaque ciphertext handle.
  - `creditPrize(address winner, euint64 prizeAmount)`: Homomorphically adds prize to the winner's confidential balance, granting **only the winner** decryption permissions.
  - **Zero Plaintext Principle**: Strictly emits `bytes32 encryptedHandle` in event logs.

### 2. `GhostVault.sol`
- **Responsibility**: Yield accounting and prize accumulation.
- **State**:
  - `euint64 private _encryptedPrizePool;`
- **Key Operations**:
  - `accrueYield()`: Homomorphically accumulates earned interest into the encrypted prize pool.
  - `harvestPrizeForDraw()`: Transfers the accumulated confidential prize to `GhostDraw`.

### 3. `GhostDraw.sol`
- **Responsibility**: Confidential draw lifecycle, onchain FHE randomness generation, and winner determination.
- **State**:
  - `mapping(uint256 => DrawRecord) private _draws;`
- **Key Operations**:
  - `openDraw()`: Starts a new draw period.
  - `executeDraw()`:
    1. Generates onchain FHE randomness (`FHE.randEuint64()`).
    2. Constructs a cryptographic state root of all encrypted participant handles.
    3. Confidentially selects the winning participant.
    4. Harvests the prize from `GhostVault` and credits it via `GhostPool.creditPrize`.
    5. Records the cryptographic commitment in `GhostVerifier`.

### 4. `GhostVerifier.sol`
- **Responsibility**: Public auditing and independent verification.
- **Key Operations**:
  - `recordDrawCommitment(...)`: Stores the state root, randomness commitment, winner address, and encrypted prize handle.
  - `verifyDraw(uint256 drawId)`: Public endpoint accessible to anyone without connecting a wallet, proving the draw was executed legitimately according to protocol rules without revealing user balances.
