// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenLearn is ERC20, ERC20Burnable, Ownable {
    uint256 public mintingFee = 0.01 ether;

    constructor() ERC20("TokenLearn", "TKL") Ownable(msg.sender) {
        transferOwnership(msg.sender);
    }

    function mintFree(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function setMintingFee(uint256 newFee) public onlyOwner {
        mintingFee = newFee;
    }

    function mintWithFee(address to, uint256 amount) public payable {
        require(
            msg.value >= mintingFee,
            "TokenLearn: Not enough Ether provided."
        );
        _mint(to, amount);
        payable(owner()).transfer(mintingFee);
    }
}
