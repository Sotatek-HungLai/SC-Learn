// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OwnableAndPayable {
    address payable public onwer;

    constructor(address _onwer) {
        onwer = payable(_onwer);
    }

    modifier onlyOnwer() {
        require(msg.sender == onwer, "You are not onwer");
        _;
    }
}
