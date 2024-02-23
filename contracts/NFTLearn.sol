// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTLearn is ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 public mintingFee = 0.01 ether;

    uint256 private _nextTokenId;

    constructor()
        ERC721("NFTLearn", "NFTL")
        ERC721URIStorage()
        ERC721Burnable()
        Ownable(msg.sender)
    {}

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function currentCounter() public view returns (uint256) {
        return _nextTokenId;
    }

    function setMintingFee(uint256 newFee) public onlyOwner {
        mintingFee = newFee;
    }

    function freeMint(address to, string memory nftTokenURI) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, nftTokenURI);
    }

    function mintWithFee(address to, string memory nftTokenURI) public payable {
        uint256 tokenId = _nextTokenId++;

        require(msg.value >= mintingFee, "Not enough Ether provided.");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, nftTokenURI);

        payable(owner()).transfer(mintingFee);
    }
}
