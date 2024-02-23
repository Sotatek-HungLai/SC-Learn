// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract TokenLearnVault is ERC4626 {
    constructor(
        address assetAddr
    ) ERC4626(IERC20(assetAddr)) ERC20("My Tokenized Vault", "MTV") {}
}
