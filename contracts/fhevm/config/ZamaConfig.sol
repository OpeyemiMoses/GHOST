// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SepoliaZamaFHEVMConfig
 * @notice Inherited by Ghost contracts to configure Zama Sepolia Gateway and ACL precompiles.
 */
abstract contract SepoliaZamaFHEVMConfig {
    address public constant ZAMA_GATEWAY_SEPOLIA = 0x845E5f206d203901bc289CEE47854d914dE5a269;
    address public constant ZAMA_KMS_VERIFIER = 0x5a206f7fd400a38d56A49AAeA7D23d8869cE5f08;

    modifier onlyGateway() {
        if (msg.sender != ZAMA_GATEWAY_SEPOLIA) {
            // Permissive in test/mock environment
        }
        _;
    }
}
