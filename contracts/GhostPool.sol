// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGhostPool.sol";
import "./fhevm/lib/FHE.sol";
import "./fhevm/config/ZamaConfig.sol";
import "./GhostVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GhostPool
 * @notice Confidential Prize-Savings Pool built with Zama Fully Homomorphic Encryption (FHE).
 * Keeps user balances and individual deposits encrypted while supporting verifiable draws and withdrawals.
 */
contract GhostPool is IGhostPool, SepoliaZamaFHEVMConfig, Ownable, ReentrancyGuard {
    // Encrypted user balances: address => euint64 ciphertext handle
    mapping(address => euint64) private _encryptedBalances;

    // Track participants confidentially (addresses are public onchain metadata, balances are private)
    address[] private _participants;
    mapping(address => bool) private _isParticipant;

    // Associated protocol contracts
    GhostVault public vault;
    address public ghostDrawContract;
    address public confidentialToken;

    modifier onlyDrawContract() {
        require(msg.sender == ghostDrawContract, "GhostPool: only draw contract authorized");
        _;
    }

    constructor(address _confidentialToken) Ownable(msg.sender) {
        confidentialToken = _confidentialToken;
    }

    function setProtocolContracts(address _vault, address _ghostDraw) external onlyOwner {
        require(_vault != address(0) && _ghostDraw != address(0), "GhostPool: zero address");
        vault = GhostVault(_vault);
        ghostDrawContract = _ghostDraw;
    }

    /**
     * @notice Confidential deposit function using client-side encrypted amount & ZK proof
     * @param encryptedAmount Ciphertext bytes generated client-side with Zama SDK
     * @param proof ZK proof of knowledge for ciphertext
     * @return encryptedHandle Ciphertext handle of the user's updated balance
     */
    function deposit(bytes calldata encryptedAmount, bytes calldata proof)
        external
        override
        nonReentrant
        returns (bytes32 encryptedHandle)
    {
        // 1. Convert client encrypted input into verified onchain euint64
        euint64 amount = FHE.asEuint64(encryptedAmount, proof);

        // 2. Homomorphically add to user's encrypted balance: Enc(balance) + Enc(amount)
        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], amount);

        // 3. Set Zama ACL decryption permissions: strictly for msg.sender
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        // 4. Register participant if first time
        if (!_isParticipant[msg.sender]) {
            _participants.push(msg.sender);
            _isParticipant[msg.sender] = true;
        }

        // 5. Trigger passive yield accrual in vault
        if (address(vault) != address(0)) {
            vault.accrueYield();
        }

        bytes32 userBalanceHandle = FHE.toBytes32(_encryptedBalances[msg.sender]);

        // CRITICAL PRIVACY PRESERVATION:
        // Do NOT emit plaintext deposit amount. Emit only the opaque encrypted ciphertext handle.
        emit Deposited(msg.sender, userBalanceHandle, block.timestamp);
        emit DepositAuthorizationGranted(msg.sender, userBalanceHandle);

        return userBalanceHandle;
    }

    /**
     * @notice Helper deposit function with plaintext seed (used for mock tests and testnet demo faucets)
     */
    function depositPlaintext(uint64 amount) external nonReentrant returns (bytes32) {
        require(amount > 0, "GhostPool: deposit amount must be > 0");
        euint64 encAmount = FHE.asEuint64(amount);

        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encAmount);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        if (!_isParticipant[msg.sender]) {
            _participants.push(msg.sender);
            _isParticipant[msg.sender] = true;
        }

        if (address(vault) != address(0)) {
            vault.accrueYield();
        }

        bytes32 handle = FHE.toBytes32(_encryptedBalances[msg.sender]);
        emit Deposited(msg.sender, handle, block.timestamp);
        emit DepositAuthorizationGranted(msg.sender, handle);

        return handle;
    }

    /**
     * @notice Confidential withdrawal preserving balance privacy
     */
    function withdraw(bytes calldata encryptedAmount, bytes calldata proof)
        external
        override
        nonReentrant
        returns (bytes32 encryptedHandle)
    {
        euint64 amount = FHE.asEuint64(encryptedAmount, proof);

        // Homomorphically subtract from user's balance: Enc(balance) - Enc(amount)
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], amount);

        // Update Zama ACL permission for new balance
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        bytes32 handle = FHE.toBytes32(_encryptedBalances[msg.sender]);

        // Emit withdrawal with opaque handle — zero plaintext leakage
        emit Withdrawn(msg.sender, handle, block.timestamp);
        return handle;
    }

    /**
     * @notice Credits encrypted prize directly to the winner's confidential balance
     * @dev Only the winner is granted decryption authorization for this prize
     */
    function creditPrize(address winner, euint64 prizeAmount) external onlyDrawContract {
        require(winner != address(0), "GhostPool: invalid winner");

        // Homomorphically add prize to winner's balance
        _encryptedBalances[winner] = FHE.add(_encryptedBalances[winner], prizeAmount);

        // Strictly authorize winner to decrypt their new balance and prize
        FHE.allow(_encryptedBalances[winner], winner);
        FHE.allow(prizeAmount, winner);

        emit DepositAuthorizationGranted(winner, FHE.toBytes32(_encryptedBalances[winner]));
    }

    /**
     * @notice Returns the user's encrypted balance handle
     * @dev In Zama fhEVM, reading this handle offchain returns ciphertext; decryption succeeds ONLY for authorized key
     */
    function getEncryptedBalanceHandle(address user) external view override returns (bytes32) {
        return FHE.toBytes32(_encryptedBalances[user]);
    }

    /**
     * @notice Returns the internal euint64 type for protocol contracts (e.g. GhostDraw)
     */
    function getEncryptedBalance(address user) external view returns (euint64) {
        require(msg.sender == ghostDrawContract || msg.sender == address(this), "GhostPool: unauthorized");
        return _encryptedBalances[user];
    }

    function totalParticipants() external view override returns (uint256) {
        return _participants.length;
    }

    function getParticipant(uint256 index) external view override returns (address) {
        require(index < _participants.length, "GhostPool: index out of bounds");
        return _participants[index];
    }

    function isParticipant(address user) external view override returns (bool) {
        return _isParticipant[user];
    }

    function getAllParticipants() external view returns (address[] memory) {
        return _participants;
    }
}
