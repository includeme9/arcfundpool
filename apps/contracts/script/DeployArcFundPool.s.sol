// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ArcFundPool.sol";

contract DeployArcFundPool is Script {
    function run() external returns (ArcFundPool arcFundPool) {
        address usdc = vm.envAddress("NEXT_PUBLIC_ARC_USDC_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        arcFundPool = new ArcFundPool(usdc);
        vm.stopBroadcast();
    }
}
