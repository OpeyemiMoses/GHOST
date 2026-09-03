// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGhostDraw {
    enum DrawStatus {
        Inactive,
        Open,
        ComputingFHE,
        Completed
    }

    struct DrawRecord {
        uint256 drawId;
        uint256 startTime;
        uint256 endTime;
        DrawStatus status;
        address winner;
        bytes32 randomnessCommitment;
        bytes32 stateRoot;
        bytes32 encryptedPrizeHandle;
        bool isVerified;
    }

    event DrawOpened(uint256 indexed drawId, uint256 startTime, uint256 endTime);
    event DrawComputing(uint256 indexed drawId, bytes32 indexed randomnessCommitment);
    event DrawCompleted(
        uint256 indexed drawId,
        address indexed winner,
        bytes32 randomnessCommitment,
        bytes32 stateRoot,
        bytes32 encryptedPrizeHandle
    );

    function currentDrawId() external view returns (uint256);
    function getDraw(uint256 drawId) external view returns (DrawRecord memory);
    function openDraw() external returns (uint256);
    function executeDraw() external returns (address winner);
}
