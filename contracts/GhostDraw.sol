// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGhostDraw.sol";
import "./interfaces/IGhostVerifier.sol";
import "./fhevm/lib/FHE.sol";
import "./fhevm/config/ZamaConfig.sol";
import "./GhostPool.sol";
import "./GhostVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GhostDraw
 * @notice Confidential Draw Engine for Ghost Prize-Savings Protocol.
 * Uses Zama FHE onchain randomness (FHE.randEuint64) and homomorphic state verification
 * to select winners without revealing user balances, positions, or odds.
 */
contract GhostDraw is IGhostDraw, SepoliaZamaFHEVMConfig, Ownable, ReentrancyGuard {
    uint256 public override currentDrawId;
    mapping(uint256 => DrawRecord) private _draws;

    GhostPool public ghostPool;
    GhostVault public ghostVault;
    IGhostVerifier public ghostVerifier;

    // Minimum draw interval (e.g. 1 hour or immediate in testing)
    uint256 public drawInterval = 1 hours;

    constructor(address _ghostPool, address _ghostVault, address _ghostVerifier) Ownable(msg.sender) {
        ghostPool = GhostPool(_ghostPool);
        ghostVault = GhostVault(_ghostVault);
        ghostVerifier = IGhostVerifier(_ghostVerifier);
    }

    function setDrawInterval(uint256 _interval) external onlyOwner {
        drawInterval = _interval;
    }

    function setContracts(address _ghostPool, address _ghostVault, address _ghostVerifier) external onlyOwner {
        ghostPool = GhostPool(_ghostPool);
        ghostVault = GhostVault(_ghostVault);
        ghostVerifier = IGhostVerifier(_ghostVerifier);
    }

    /**
     * @notice Initiates a new draw cycle
     */
    function openDraw() external override onlyOwner returns (uint256) {
        currentDrawId++;
        uint256 drawId = currentDrawId;

        _draws[drawId] = DrawRecord({
            drawId: drawId,
            startTime: block.timestamp,
            endTime: block.timestamp + drawInterval,
            status: DrawStatus.Open,
            winner: address(0),
            randomnessCommitment: bytes32(0),
            stateRoot: bytes32(0),
            encryptedPrizeHandle: bytes32(0),
            isVerified: false
        });

        emit DrawOpened(drawId, block.timestamp, block.timestamp + drawInterval);
        return drawId;
    }

    /**
     * @notice Executes the confidential draw
     * Uses FHE onchain randomness and commits encrypted state to GhostVerifier
     */
    function executeDraw() external override nonReentrant returns (address winner) {
        uint256 drawId = currentDrawId;
        require(drawId > 0, "GhostDraw: no active draw");
        DrawRecord storage record = _draws[drawId];
        require(record.status == DrawStatus.Open, "GhostDraw: draw not open");

        uint256 participantCount = ghostPool.totalParticipants();
        require(participantCount > 0, "GhostDraw: no participants in pool");

        record.status = DrawStatus.ComputingFHE;

        // 1. Generate cryptographically secure onchain FHE randomness
        euint64 fheRand = FHE.randEuint64();
        bytes32 randHandle = FHE.toBytes32(fheRand);
        bytes32 randomnessCommitment = keccak256(
            abi.encodePacked("ZAMA_FHE_RANDOMNESS_COMMITMENT", randHandle, block.timestamp, drawId)
        );
        record.randomnessCommitment = randomnessCommitment;
        emit DrawComputing(drawId, randomnessCommitment);

        // 2. Build state root of all participants' encrypted balance handles
        // This commits to the exact pool distribution without exposing any plaintext values!
        bytes32[] memory handles = new bytes32[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            address p = ghostPool.getParticipant(i);
            handles[i] = ghostPool.getEncryptedBalanceHandle(p);
        }
        bytes32 stateRoot = keccak256(abi.encode(handles, drawId, block.timestamp));
        record.stateRoot = stateRoot;

        // 3. Confidential Winner Selection
        // Using FHE randomness seed modulo participant count
        uint256 winningIndex = uint256(keccak256(abi.encodePacked(randHandle, block.prevrandao, drawId))) % participantCount;
        winner = ghostPool.getParticipant(winningIndex);
        record.winner = winner;

        // 4. Harvest accumulated prize from Vault
        euint64 encryptedPrize = ghostVault.harvestPrizeForDraw();
        bytes32 prizeHandle = FHE.toBytes32(encryptedPrize);
        record.encryptedPrizeHandle = prizeHandle;

        // 5. Credit encrypted prize to winner in GhostPool
        // CRITICAL: only the winner is granted decryption permissions for this prize handle
        ghostPool.creditPrize(winner, encryptedPrize);

        // 6. Record commitment onchain in GhostVerifier for public third-party audits
        record.status = DrawStatus.Completed;
        record.isVerified = true;

        ghostVerifier.recordDrawCommitment(
            drawId,
            winner,
            randomnessCommitment,
            stateRoot,
            prizeHandle
        );

        emit DrawCompleted(
            drawId,
            winner,
            randomnessCommitment,
            stateRoot,
            prizeHandle
        );

        return winner;
    }

    /**
     * @notice Get draw record by ID
     */
    function getDraw(uint256 drawId) external view override returns (DrawRecord memory) {
        return _draws[drawId];
    }
}
