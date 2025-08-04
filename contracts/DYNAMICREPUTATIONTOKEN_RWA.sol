// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DynamicReputationToken
 * @author E-co.lab Dev Team
 * @notice A contract for a non-transferable (Soulbound) reputation token
 * whose balance is dynamically calculated based on a user's average rating.
 * This contract mimics an ERC-20 interface but is not a standard token.
 */
contract DynamicReputationToken {
    
    // Basic metadata to resemble a token
    string public name = "Service Provider Reputation";
    string public symbol = "REP";
    uint8 public decimals = 0; // We use whole numbers (e.g., 496)

    // Struct to store the raw reputation data for each service provider
    struct ReputationData {
        uint256 totalRatingPoints; // Sum of all star ratings (e.g., 5 + 4 + 5 + ...)
        uint256 ratingCount;       // Total number of ratings received
    }

    // Mapping from the service provider's address to their reputation data
    mapping(address => ReputationData) public reputation;

    // --- Administrative Functions (example of how data would be added) ---

    /**
     * @notice Adds a new rating for a service provider.
     * @dev In a real system, this function would have strict access control.
     * Only a customer who completed and paid for a service could call it.
     * @param provider The address of the service provider being rated.
     * @param rating The rating, from 1 to 5 stars.
     */
    function addRating(address provider, uint8 rating) external {
        // Simple check to ensure the rating is within the correct scale
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        
        ReputationData storage providerReputation = reputation[provider];
        providerReputation.totalRatingPoints += rating;
        providerReputation.ratingCount += 1;
    }

    // --- Read Functions (the core of the dynamic logic) ---

    /**
     * @notice Calculates a provider's average reputation score, multiplied by 100.
     * @return The average score (e.g., a 4.96 average returns 496).
     */
    function getAverageScore(address provider) public view returns (uint256) {
        ReputationData memory providerReputation = reputation[provider];

        // Avoid division by zero if the provider has no ratings
        if (providerReputation.ratingCount == 0) {
            return 0;
        }

        // Calculate the average. We multiply by 100 BEFORE dividing to maintain 2 decimal places of precision.
        // E.g., (498 points * 100) / 100 ratings = 498
        return (providerReputation.totalRatingPoints * 100) / providerReputation.ratingCount;
    }

    /**
     * @notice The "magic" function. It mimics the balanceOf function of an ERC-20.
     * @dev Returns a provider's "reputation token" balance, which is their calculated average score.
     */
    function balanceOf(address provider) public view returns (uint256) {
        return getAverageScore(provider);
    }
    
    // --- Transfer Functions (Blocked to behave like an SBT) ---

    /**
     * @notice Transfer is disabled. Reputation cannot be transferred.
     */
    function transfer(address, uint256) external pure returns (bool) {
        revert("Reputation tokens are non-transferable");
    }

    /**
     * @notice Approval is disabled. Reputation cannot be delegated.
     */
    function approve(address, uint256) external pure returns (bool) {
        revert("Reputation tokens cannot be approved for transfer");
    }
}
