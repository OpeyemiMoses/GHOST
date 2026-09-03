// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./fhevm/lib/FHE.sol";

/**
 * @title MockConfidentialToken (cUSDC)
 * @notice Confidential token implementing Zama FHE encrypted balances and transfers.
 * Used for testing and Sepolia testnet demonstrations of confidential prize savings.
 */
contract MockConfidentialToken {
    string public name;
    string public symbol;
    uint8 public immutable decimals;

    // Encrypted balances mapping: address => euint64 ciphertext handle
    mapping(address => euint64) private _balances;

    // Encrypted allowances: owner => spender => euint64
    mapping(address => mapping(address => euint64)) private _allowances;

    // Track accounts that hold an encrypted position
    address[] private _holders;
    mapping(address => bool) private _isHolder;

    event ConfidentialTransfer(address indexed from, address indexed to, bytes32 indexed ciphertextHandle);
    event ConfidentialApproval(address indexed owner, address indexed spender, bytes32 indexed ciphertextHandle);
    event ConfidentialMint(address indexed to, bytes32 indexed ciphertextHandle);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    /**
     * @notice Mints confidential tokens to an address from encrypted input & proof
     */
    function mint(address to, bytes calldata encryptedAmount, bytes calldata proof) external returns (bytes32) {
        require(to != address(0), "Cannot mint to zero address");
        euint64 amount = FHE.asEuint64(encryptedAmount, proof);
        
        _balances[to] = FHE.add(_balances[to], amount);
        FHE.allow(_balances[to], to);

        if (!_isHolder[to]) {
            _holders.push(to);
            _isHolder[to] = true;
        }

        bytes32 handle = FHE.toBytes32(_balances[to]);
        emit ConfidentialMint(to, handle);
        return handle;
    }

    /**
     * @notice Mints confidential tokens with a plaintext seed (helper for testing)
     */
    function mintPlaintext(address to, uint64 amount) external returns (bytes32) {
        require(to != address(0), "Cannot mint to zero address");
        euint64 encAmount = FHE.asEuint64(amount);

        _balances[to] = FHE.add(_balances[to], encAmount);
        FHE.allow(_balances[to], to);

        if (!_isHolder[to]) {
            _holders.push(to);
            _isHolder[to] = true;
        }

        bytes32 handle = FHE.toBytes32(_balances[to]);
        emit ConfidentialMint(to, handle);
        return handle;
    }

    /**
     * @notice Transfers encrypted balance to recipient
     */
    function confidentialTransfer(address to, bytes calldata encryptedAmount, bytes calldata proof) external returns (bytes32) {
        require(to != address(0), "Cannot transfer to zero address");
        euint64 amount = FHE.asEuint64(encryptedAmount, proof);

        _balances[msg.sender] = FHE.sub(_balances[msg.sender], amount);
        _balances[to] = FHE.add(_balances[to], amount);

        FHE.allow(_balances[msg.sender], msg.sender);
        FHE.allow(_balances[to], to);

        if (!_isHolder[to]) {
            _holders.push(to);
            _isHolder[to] = true;
        }

        bytes32 handle = FHE.toBytes32(amount);
        emit ConfidentialTransfer(msg.sender, to, handle);
        return handle;
    }

    /**
     * @notice Returns the user's encrypted balance handle (only decryptable by authorized user via ACL)
     */
    function balanceOfEncrypted(address account) external view returns (bytes32) {
        return FHE.toBytes32(_balances[account]);
    }
}
