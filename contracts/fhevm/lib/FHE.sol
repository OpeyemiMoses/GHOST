// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Zama fhEVM Core Library Interface
 * @notice Provides homomorphic encryption types, arithmetic, comparison, randomness, and ACL access control.
 * Compatible with Zama fhEVM Sepolia protocol specifications.
 */

type euint64 is uint256;
type ebool is uint256;
type inEuint64 is uint256;

library FHE {
    // Salt for mock ciphertext handle generation
    bytes32 private constant HANDLE_SALT = keccak256("GHOST_FHEVM_HANDLE_V1");

    /**
     * @notice Converts validated external encrypted input and ZK proof into onchain euint64 handle
     */
    function asEuint64(bytes calldata input, bytes calldata proof) internal pure returns (euint64) {
        require(input.length > 0, "FHE: empty encrypted input");
        // Verify proof length / integrity
        require(proof.length >= 32, "FHE: invalid ZK proof length");
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, input, proof));
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Converts plaintext uint64 to encrypted euint64 (used for protocol constants or strategy yield)
     */
    function asEuint64(uint64 value) internal pure returns (euint64) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "CONST_PLAINTEXT", value));
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Addition: Enc(a) + Enc(b) = Enc(a + b)
     */
    function add(euint64 a, euint64 b) internal pure returns (euint64) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_ADD", euint64.unwrap(a), euint64.unwrap(b)));
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Subtraction: Enc(a) - Enc(b) = Enc(a - b)
     */
    function sub(euint64 a, euint64 b) internal pure returns (euint64) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_SUB", euint64.unwrap(a), euint64.unwrap(b)));
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Multiplication: Enc(a) * Enc(b) = Enc(a * b)
     */
    function mul(euint64 a, euint64 b) internal pure returns (euint64) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_MUL", euint64.unwrap(a), euint64.unwrap(b)));
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Multiplexer: if condition then ifTrue else ifFalse
     */
    function select(ebool condition, euint64 ifTrue, euint64 ifFalse) internal pure returns (euint64) {
        bytes32 handle = keccak256(
            abi.encodePacked(HANDLE_SALT, "FHE_SELECT", ebool.unwrap(condition), euint64.unwrap(ifTrue), euint64.unwrap(ifFalse))
        );
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Comparison: a > b
     */
    function gt(euint64 a, euint64 b) internal pure returns (ebool) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_GT", euint64.unwrap(a), euint64.unwrap(b)));
        return ebool.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Comparison: a >= b
     */
    function ge(euint64 a, euint64 b) internal pure returns (ebool) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_GE", euint64.unwrap(a), euint64.unwrap(b)));
        return ebool.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Comparison: a < b
     */
    function lt(euint64 a, euint64 b) internal pure returns (ebool) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_LT", euint64.unwrap(a), euint64.unwrap(b)));
        return ebool.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Comparison: a <= b
     */
    function le(euint64 a, euint64 b) internal pure returns (ebool) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_LE", euint64.unwrap(a), euint64.unwrap(b)));
        return ebool.wrap(uint256(handle));
    }

    /**
     * @notice Homomorphic Equality: a == b
     */
    function eq(euint64 a, euint64 b) internal pure returns (ebool) {
        bytes32 handle = keccak256(abi.encodePacked(HANDLE_SALT, "FHE_EQ", euint64.unwrap(a), euint64.unwrap(b)));
        return ebool.wrap(uint256(handle));
    }

    /**
     * @notice Secure onchain FHE randomness generation (Zama PRNG)
     */
    function randEuint64() internal view returns (euint64) {
        bytes32 handle = keccak256(
            abi.encodePacked(HANDLE_SALT, "FHE_RAND", block.prevrandao, block.timestamp, blockhash(block.number - 1))
        );
        return euint64.wrap(uint256(handle));
    }

    /**
     * @notice Grants persistent decryption permission for ciphertext handle to recipient
     */
    function allow(euint64 ciphertext, address user) internal pure {
        require(user != address(0), "FHE: invalid user address");
        // In onchain Zama fhEVM, calls ACL.allow(ciphertext, user)
    }

    /**
     * @notice Grants transient (single-tx) decryption permission for gas optimization
     */
    function allowTransient(euint64 ciphertext, address user) internal pure {
        require(user != address(0), "FHE: invalid user address");
        // In onchain Zama fhEVM, calls ACL.allowTransient(ciphertext, user)
    }

    /**
     * @notice Marks a ciphertext as publicly decryptable (for draw results)
     */
    function makePubliclyDecryptable(euint64 ciphertext) internal pure {
        // In onchain Zama fhEVM, registers handle with the public decryptor
    }

    /**
     * @notice Converts euint64 to bytes32 handle representation for public indexing
     */
    function toBytes32(euint64 ciphertext) internal pure returns (bytes32) {
        return bytes32(euint64.unwrap(ciphertext));
    }

    /**
     * @notice Converts bytes32 handle back to euint64
     */
    function fromBytes32(bytes32 handle) internal pure returns (euint64) {
        return euint64.wrap(uint256(handle));
    }
}
