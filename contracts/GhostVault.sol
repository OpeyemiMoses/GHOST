// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./fhevm/lib/FHE.sol";
import "./fhevm/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GhostVault
 * @notice Yield-generating vault for Ghost Prize-Savings Protocol.
 * Accrues yield into an encrypted prize pool using Zama FHE without revealing individual pool values.
 */
contract GhostVault is SepoliaZamaFHEVMConfig, Ownable {
    // Encrypted accumulated prize pool
    euint64 private _encryptedPrizePool;

    // Yield rate basis points (e.g., 850 = 8.5% APY)
    uint256 public yieldRateBps = 850;
    uint256 public lastYieldAccrualTime;

    address public ghostPool;
    address public ghostDraw;

    event YieldAccrued(uint256 timestamp, bytes32 indexed prizePoolHandle);
    event PrizeAllocated(address indexed drawContract, bytes32 indexed prizeHandle);

    modifier onlyAuthorized() {
        require(
            msg.sender == ghostPool || msg.sender == ghostDraw || msg.sender == owner(),
            "GhostVault: caller not authorized"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        lastYieldAccrualTime = block.timestamp;
        // Initialize encrypted prize pool with initial seed yield
        _encryptedPrizePool = FHE.asEuint64(500 * 1e6); // 500 cUSDC initial reward pool
    }

    function setProtocolAddresses(address _ghostPool, address _ghostDraw) external onlyOwner {
        ghostPool = _ghostPool;
        ghostDraw = _ghostDraw;
    }

    /**
     * @notice Accrues yield into the encrypted prize pool
     */
    function accrueYield() external onlyAuthorized returns (bytes32) {
        uint256 timeElapsed = block.timestamp - lastYieldAccrualTime;
        if (timeElapsed > 0) {
            // Calculate simulated confidential yield: e.g. 50 cUSDC per interval
            uint64 yieldAmount = uint64((timeElapsed * 10 * 1e6) / 3600); // 10 USDC per hour
            if (yieldAmount > 0) {
                euint64 encYield = FHE.asEuint64(yieldAmount);
                _encryptedPrizePool = FHE.add(_encryptedPrizePool, encYield);
            }
            lastYieldAccrualTime = block.timestamp;
        }

        bytes32 handle = FHE.toBytes32(_encryptedPrizePool);
        emit YieldAccrued(block.timestamp, handle);
        return handle;
    }

    /**
     * @notice Claims the accumulated prize pool for a draw and resets current draw pool
     */
    function harvestPrizeForDraw() external onlyAuthorized returns (euint64) {
        euint64 prizeToDistribute = _encryptedPrizePool;

        // Replenish base prize pool for the next cycle (seed with 250 cUSDC)
        _encryptedPrizePool = FHE.asEuint64(250 * 1e6);

        emit PrizeAllocated(msg.sender, FHE.toBytes32(prizeToDistribute));
        return prizeToDistribute;
    }

    /**
     * @notice Injects external yield or seed rewards into the confidential prize pool
     */
    function injectEncryptedPrize(bytes calldata encryptedAmount, bytes calldata proof) external returns (bytes32) {
        euint64 amount = FHE.asEuint64(encryptedAmount, proof);
        _encryptedPrizePool = FHE.add(_encryptedPrizePool, amount);
        bytes32 handle = FHE.toBytes32(_encryptedPrizePool);
        emit YieldAccrued(block.timestamp, handle);
        return handle;
    }

    /**
     * @notice Returns the encrypted prize pool handle (confidential)
     */
    function getEncryptedPrizePoolHandle() external view returns (bytes32) {
        return FHE.toBytes32(_encryptedPrizePool);
    }
}
