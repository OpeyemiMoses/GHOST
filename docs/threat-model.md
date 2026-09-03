# Ghost Security Threat Model

## Overview

Ghost secures user capital and confidential state against adversarial attacks on Ethereum Sepolia. This document outlines potential threat vectors and our cryptographic and architectural mitigations.

---

## Threat Matrix

### 1. Unauthorized Balance Decryption
* **Threat**: An adversary attempts to read another user's balance from contract storage or request decryption from Zama's Key Management Service (KMS).
* **Mitigation**:
  - All balance state is stored as `euint64` handles.
  - Ghost utilizes Zama's native Access Control List (ACL) via `FHE.allow(ciphertext, user)`.
  - The Zama KMS verifies an EIP-712 cryptographic signature proving that the caller is the authorized owner before generating a re-encryption key. Any query by an unauthorized party fails at the KMS threshold level.

### 2. Information Leakage via Event Logs
* **Threat**: Smart contract events accidentally include deposit amounts, withdrawal values, or ticket weights, rendering onchain FHE useless.
* **Mitigation**:
  - Ghost enforces a **Zero Plaintext Event Policy**.
  - All events (`Deposited`, `Withdrawn`, `YieldAccrued`) emit only the 32-byte opaque ciphertext handle (`bytes32 indexed encryptedHandle`) and block timestamp.
  - This is verified by automated regression tests in `test/PrivacyIntegrity.test.ts`.

### 3. Draw Manipulation & Rigged Winner Selection
* **Threat**: A malicious operator attempts to pre-determine or rig the draw winner.
* **Mitigation**:
  - The draw engine executes exclusively onchain.
  - Randomness is generated using Zama's cryptographically secure PRNG (`FHE.randEuint64()`) seeded with `block.prevrandao` and prior block hashes.
  - The state root of all participants' encrypted handles is immutably committed to `GhostVerifier` at the moment of draw execution, preventing retrofitting of winners.

### 4. Malicious Prize Sniffing / Decryption by Non-Winners
* **Threat**: Observers try to figure out how much the winner won.
* **Mitigation**:
  - When `GhostPool.creditPrize` is called, `FHE.allow(prizeAmount, winner)` explicitly grants viewing rights **only to the winner**.
  - Non-winning participants and outside observers cannot decrypt the prize amount ciphertext.

### 5. Reentrancy & Contract Exploits
* **Threat**: Reentrancy attacks during deposit or withdrawal flows.
* **Mitigation**:
  - All state-mutating functions implement OpenZeppelin's `ReentrancyGuard` (`nonReentrant` modifier).
  - Cross-contract authorizations between `GhostPool`, `GhostVault`, `GhostDraw`, and `GhostVerifier` use strict access modifiers (`onlyDrawContract`, `onlyAuthorized`).
