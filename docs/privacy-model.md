# Ghost Privacy Model

## The Three Conceptual Privacy Layers

Ghost separates privacy into three explicit layers. Acknowledging these boundaries demonstrates technical maturity: FHE does not provide full network anonymity, but it provides complete confidential computation and financial state protection.

---

### Layer 1: Balance Privacy (Fully Confidential)
* **What is protected**: The user's deposit amount, current principal balance, accumulated yield, and won prize amount.
* **Mechanism**: Stored exclusively as Zama `euint64` ciphertexts in contract storage.
* **Observer View**: An outside observer reading contract storage or transaction events sees only opaque 32-byte ciphertext handles (e.g., `0x7b84f3...a9`). They cannot determine whether a user has $10 or $10,000,000.
* **Authorized View**: Only the authenticated user holding the corresponding private key can decrypt their balance via Zama KMS EIP-712 permission signatures (`FHE.allow`).

---

### Layer 2: Computation Privacy (Homomorphic Execution)
* **What is protected**: Ticket weights, participant odds, intermediate sums, and winner selection.
* **Mechanism**: All protocol operations occur directly over ciphertexts:
  $$\text{Enc}(Balance) + \text{Enc}(Yield) = \text{Enc}(NewBalance)$$
* **Winner Determination**: Winner selection is computed onchain using Zama's secure pseudo-random number generator (`FHE.randEuint64()`).
* **Zero Plaintext Principle**: The protocol never decrypts intermediate balances for convenience or accounting.

---

### Layer 3: Metadata Privacy (Public Blockchain Transparency)
* **What remains public**: 
  - Wallet addresses interacting with the contract.
  - Transaction existence and timestamp.
  - Gas consumption and network transaction hashes.
  - The revealed winner's address and draw commitment proofs.
* **Design Rationale**: In public EVM chains (such as Ethereum Sepolia), transaction existence and sender addresses are protocol-level metadata. Ghost does not make false claims of complete anonymization; instead, it guarantees that **nobody on the network learns your financial position, balance, or odds**.

---

## Contrast: Traditional PoolTogether vs. Ghost

| Feature | Traditional PoolTogether | Ghost Protocol (Zama FHE) |
| :--- | :--- | :--- |
| **Deposit Amount** | Publicly visible in tx and events | **Encrypted (`euint64`)** |
| **User Balance** | Public plaintext integer | **Confidential ciphertext handle** |
| **Participant Odds** | Publicly calculable by anyone | **Confidential** |
| **Winner Prize Amount** | Publicly visible in event logs | **Encrypted (only winner can decrypt)** |
| **Yield Accrual** | Public onchain integers | **Encrypted homomorphic accumulation** |
| **Draw Outcome** | Public | **Publicly verifiable with zero balance leakage** |
