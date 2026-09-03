// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGhostPool {
    event Deposited(address indexed user, bytes32 indexed encryptedHandle, uint256 timestamp);
    event Withdrawn(address indexed user, bytes32 indexed encryptedHandle, uint256 timestamp);
    event DepositAuthorizationGranted(address indexed user, bytes32 indexed handle);

    function deposit(bytes calldata encryptedAmount, bytes calldata proof) external returns (bytes32);
    function withdraw(bytes calldata encryptedAmount, bytes calldata proof) external returns (bytes32);
    function getEncryptedBalanceHandle(address user) external view returns (bytes32);
    function totalParticipants() external view returns (uint256);
    function getParticipant(uint256 index) external view returns (address);
    function isParticipant(address user) external view returns (bool);
}
