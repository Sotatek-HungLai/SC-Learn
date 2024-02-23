// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BalanceContract {
    address public contractAddress;

    function getBlance() public view returns (uint256) {
        return contractAddress.balance;
    }

    function setContractAddress(address _contractAddress) public {
        contractAddress = _contractAddress;
    }
}
