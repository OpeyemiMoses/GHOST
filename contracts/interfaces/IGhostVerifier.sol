// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGhostVerifier {
    struct DrawProof {
        uint256 drawId;
        uint256 timestamp;
        address winner;
        bytes32 randomnessCommitment;
        bytes32 stateRoot;
        bytes32 encryptedPrizeHandle;
        bool isVerified;
    }

    event DrawCommitmentRecorded(
        uint256 indexed drawId,
        address indexed winner,
        bytes32 randomnessCommitment,
        bytes32 stateRoot
    );

    event DrawAudited(
        uint256 indexed drawId,
        bool indexed valid,
        bytes32 verificationHash
    );

    function recordDrawCommitment(
        uint256 drawId,
        address winner,
        bytes32 randomnessCommitment,
        bytes32 stateRoot,
        bytes32 encryptedPrizeHandle
    ) external;

    function verifyDraw(uint256 drawId)
        external
        view
        returns (
            bool isValid,
            bytes32 stateRoot,
            bytes32 randomnessCommitment,
            address winner,
            bytes32 encryptedPrizeHandle,
            uint256 timestamp
        );

    function getDrawProof(uint256 drawId) external view returns (DrawProof memory);
}
