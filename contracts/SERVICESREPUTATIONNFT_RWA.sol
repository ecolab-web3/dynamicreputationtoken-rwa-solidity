// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ServicesReputationNFT
 * @notice An ERC721 contract to issue achievement NFTs to high-performing service providers.
 * Ownership of this contract will be transferred to the DynamicReputationToken contract.
 */
contract ServicesReputationNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping from the token ID to its "vintage" (year and month of the achievement)
    mapping(uint256 => string) public tokenVintage;

    constructor(address initialOwner)
        ERC721("E-co.lab Services Achiever", "E-ACH")
        Ownable(initialOwner)
    {}

    /**
     * @notice Only the owner (the reputation contract) can mint a new achievement NFT.
     * @param to The address of the service provider who will receive the NFT.
     * @param vintage A string representing the month and year of the achievement (e.g., "2024-08").
     */
    function awardAchievement(address to, string memory vintage) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        tokenVintage[tokenId] = vintage;
        _safeMint(to, tokenId);
    }
}
