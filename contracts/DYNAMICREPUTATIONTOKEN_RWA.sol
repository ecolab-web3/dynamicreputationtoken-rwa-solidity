// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface for this contract to call the ServicesReputationNFT contract
interface IServicesReputationNFT {
    function awardAchievement(address to, string memory vintage) external;
}

/**
 * @title DYNAMICREPUTATIONTOKEN_RWA
 * @author E-co.lab Dev Team
 * @notice A Soulbound reputation token that dynamically calculates the average score
 * and allows service providers to claim monthly achievement NFTs.
 */
contract DYNAMICREPUTATIONTOKEN_RWA {
    
    // Updated metadata
    string public name = "E-co.lab Services Reputations";
    string public symbol = "E-REP";
    uint8 public decimals = 0;

    // Struct for reputation data
    struct ReputationData {
        uint256 totalRatingPoints;
        uint256 ratingCount;
    }

    mapping(address => ReputationData) public reputation;
    
    // --- Monthly Achievement Logic ---
    
    // Address of the Services Reputation NFT contract
    IServicesReputationNFT public achievementContract;

    // Mapping to track who has already claimed an award for a given month/year.
    // E.g., hasClaimed[provider]["202408"] = true
    mapping(address => mapping(uint256 => bool)) public hasClaimedMonthlyAward;
    
    // The minimum average score to be eligible for an award (4.9 * 100)
    uint256 public constant MINIMUM_SCORE_FOR_AWARD = 490;

    /**
     * @param _achievementContractAddress The address of the already-deployed ServicesReputationNFT contract.
     */
    constructor(address _achievementContractAddress) {
        achievementContract = IServicesReputationNFT(_achievementContractAddress);
    }

    // --- Core Reputation Functions ---

    /**
     * @notice Adds a new rating for a service provider.
     * @dev In a real system, this function would have strict access control.
     * @param provider The address of the service provider being rated.
     * @param rating The rating, from 1 to 5 stars.
     */
    function addRating(address provider, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        ReputationData storage providerReputation = reputation[provider];
        providerReputation.totalRatingPoints += rating;
        providerReputation.ratingCount += 1;
    }

    /**
     * @notice Calculates a provider's average reputation score, multiplied by 100.
     */
    function getAverageScore(address provider) public view returns (uint256) {
        ReputationData memory providerReputation = reputation[provider];
        if (providerReputation.ratingCount == 0) return 0;
        return (providerReputation.totalRatingPoints * 100) / providerReputation.ratingCount;
    }

    /**
     * @notice Mimics the balanceOf function, returning the dynamic reputation score.
     */
    function balanceOf(address provider) public view returns (uint256) {
        return getAverageScore(provider);
    }

    // --- New Award Claim Function ---

    /**
     * @notice Allows a service provider to claim their monthly achievement NFT
     * if their current average reputation score is 4.9 or higher.
     */
    function claimMonthlyAchievement() external {
        address provider = msg.sender;
        
        // Check if the current score is high enough
        uint256 currentScore = getAverageScore(provider);
        require(currentScore >= MINIMUM_SCORE_FOR_AWARD, "Your reputation score is too low");

        // Generate a unique key for the current year and month (e.g., 202408)
        (uint256 year, uint256 month, ) = _timestampToDate(block.timestamp);
        uint256 vintageKey = year * 100 + month;

        // Check if the award for this month has already been claimed
        require(!hasClaimedMonthlyAward[provider][vintageKey], "This month's award has already been claimed");
        
        // Mark the award as claimed for this month
        hasClaimedMonthlyAward[provider][vintageKey] = true;

        // Create the "vintage" string for the NFT (e.g., "2024-08")
        string memory vintageString = _uintToVintageString(year, month);

        // Call the NFT contract to mint the award
        achievementContract.awardAchievement(provider, vintageString);
    }

    // --- Transfer Functions (Blocked for SBT behavior) ---

    function transfer(address, uint256) external pure returns (bool) {
        revert("Reputation tokens are non-transferable");
    }

    function approve(address, uint256) external pure returns (bool) {
        revert("Reputation tokens cannot be approved for transfer");
    }

    // --- Internal Helper Functions ---

    function _timestampToDate(uint256 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day) {
        // Simple date conversion, not perfectly accurate but sufficient for monthly tracking.
        (year, month, day) = (timestamp / 31536000 + 1970, (timestamp % 31536000) / 2628000 + 1, (timestamp % 2628000) / 86400 + 1);
    }
    
    function _uintToVintageString(uint256 year, uint256 month) internal pure returns (string memory) {
        // Pads month with a leading zero if needed (e.g., 8 -> "08")
        bytes memory monthBytes = month < 10 
            ? abi.encodePacked(bytes1(uint8(48)), bytes1(uint8(48 + month))) 
            : abi.encodePacked(bytes1(uint8(48 + (month / 10))), bytes1(uint8(48 + (month % 10))));
        return string(abi.encodePacked(_uintToString(year),"-",string(monthBytes)));
    }
    
    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
