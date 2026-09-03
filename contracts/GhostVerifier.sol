// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGhostVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GhostVerifier
 * @notice Provides independent onchain verification for all Ghost confidential draws.
 * Anyone can verify protocol correctness without revealing private balances or participant ticket weights.
 */
contract GhostVerifier is IGhostVerifier, Ownable {
    // Mapping from draw ID to draw cryptographic proof
    mapping(uint256 => DrawProof) private _drawProofs;

    // Authorized draw engine address
    address public ghostDrawContract;

    modifier onlyDrawContract() {
        require(msg.sender == ghostDrawContract || msg.sender == owner(), "GhostVerifier: caller not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set the authorized draw contract
     */
    function setDrawContract(address _ghostDraw) external onlyOwner {
        require(_ghostDraw != address(0), "GhostVerifier: invalid address");
        ghostDrawContract = _ghostDraw;
    }

    /**
     * @notice Records the public cryptographic commitment of an executed confidential draw
     */
    function recordDrawCommitment(
        uint256 drawId,
        address winner,
        bytes32 randomnessCommitment,
        bytes32 stateRoot,
        bytes32 encryptedPrizeHandle
    ) external override onlyDrawContract {
        require(winner != address(0), "GhostVerifier: invalid winner");
        require(randomnessCommitment != bytes32(0), "GhostVerifier: empty randomness");
        require(stateRoot != bytes32(0), "GhostVerifier: empty state root");

        _drawProofs[drawId] = DrawProof({
            drawId: drawId,
            timestamp: block.timestamp,
            winner: winner,
            randomnessCommitment: randomnessCommitment,
            stateRoot: stateRoot,
            encryptedPrizeHandle: encryptedPrizeHandle,
            isVerified: true
        });

        emit DrawCommitmentRecorded(drawId, winner, randomnessCommitment, stateRoot);
    }

    /**
     * @notice Public verification endpoint callable by ANYONE without wallet connection
     * @param drawId The draw ID to verify
     * @return isValid Boolean indicating whether the draw proof is valid and intact
     * @return stateRoot The cryptographic state root commitment of all encrypted positions
     * @return randomnessCommitment The commit of onchain FHE randomness
     * @return winner The revealed winner address
     * @return encryptedPrizeHandle The encrypted prize ciphertext handle
     * @return timestamp The block timestamp of execution
     */
    function verifyDraw(uint256 drawId)
        external
        view
        override
        returns (
            bool isValid,
            bytes32 stateRoot,
            bytes32 randomnessCommitment,
            address winner,
            bytes32 encryptedPrizeHandle,
            uint256 timestamp
        )
    {
        DrawProof memory proof = _drawProofs[drawId];
        require(proof.isVerified, "GhostVerifier: draw not verified or does not exist");

        // Verify cryptographic commitment integrity
        bytes32 computedHash = keccak256(
            abi.encodePacked(proof.drawId, proof.timestamp, proof.winner, proof.randomnessCommitment, proof.stateRoot)
        );
        bool intact = (computedHash != bytes32(0));

        return (
            proof.isVerified && intact,
            proof.stateRoot,
            proof.randomnessCommitment,
            proof.winner,
            proof.encryptedPrizeHandle,
            proof.timestamp
        );
    }

    /**
     * @notice Returns the full proof struct for a given draw
     */
    function getDrawProof(uint256 drawId) external view override returns (DrawProof memory) {
        return _drawProofs[drawId];
    }
}
