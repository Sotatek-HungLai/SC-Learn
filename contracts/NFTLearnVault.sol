// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTLearnVault is IERC721Receiver {
    mapping(uint256 => address) public tokenDeposits;

    IERC721 public immutable nftContract;

    constructor(address _nftContractAddr) {
        nftContract = IERC721(_nftContractAddr);
    }

    function deposit(uint256 tokenId) external {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            string.concat(
                "NFTLearnVault: ",
                Strings.toHexString(uint256(uint160(msg.sender)), 20),
                " is not nft owner"
            )
        );
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        tokenDeposits[tokenId] = msg.sender;
    }

    function withdraw(uint256 tokenId) external {
        require(
            tokenDeposits[tokenId] == msg.sender,
            string.concat(
                "NFTLearnVault: ",
                Strings.toHexString(uint256(uint160(msg.sender)), 20),
                " is not nft owner"
            )
        );
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
        delete tokenDeposits[tokenId];
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
