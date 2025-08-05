# Dynamic Reputation Token as a Real-World Asset (RWA)

![Language](https://img.shields.io/badge/Language-Solidity-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche_Fuji-red)
![Verified Contract](https://img.shields.io/badge/Contract-Verified-green)
![License](https://img.shields.io/badge/License-MIT-blue)

This repository contains a smart contract ecosystem that tokenizes **user reputation** as a dynamic, non-transferable Real-World Asset (RWA). It's designed to solve the problem of platform-locked reputation in the gig economy, freelancer marketplaces, and other service-based platforms.

This project has been successfully deployed and verified on the **Avalanche Fuji Testnet**.

## Live Interaction & Contracts

This project consists of two interconnected smart contracts. The primary way to interact with them is directly through the block explorer. Please make sure your wallet (e.g., MetaMask) is connected to the **Avalanche Fuji Testnet**.

### Contract Details

#### 1. Main Reputation Contract (`DYNAMICREPUTATIONTOKEN_RWA.sol`)
This is the core contract that calculates dynamic reputation scores and allows users to claim achievement awards.
*   **Address:** [`0x1c6e9aF609eD270AA0120118fFA5e4f26d2D96E7`](https://testnet.snowtrace.io/address/0x1c6e9aF609eD270AA0120118fFA5e4f26d2D96E7)
*   **Interact:** **[Read / Write on Snowtrace](https://testnet.snowtrace.io/address/0x1c6e9aF609eD270AA0120118fFA5e4f26d2D96E7#writeContract)**

#### 2. Achievement NFT Contract (`SERVICESREPUTATIONNFT_RWA.sol`)
This ERC721 contract mints the monthly achievement "trophies". **Its owner has been set to the Main Reputation Contract**, ensuring only it can award NFTs.
*   **Address:** [`0x0e735190BdB2f4EdB6503ee85309fa0fB1D54793`](https://testnet.snowtrace.io/address/0x0e735190BdB2f4EdB6503ee85309fa0fB1D54793)
*   **Interact:** **[Read on Snowtrace](https://testnet.snowtrace.io/address/0x0e735190BdB2f4EdB6503ee85309fa0fB1D54793#readContract)**

---

## Overview

The core idea is to transform a service provider's reputation into a **Soulbound Token (SBT)** whose balance dynamically reflects their real-world service quality. High performance is further rewarded with unique, collectible **Achievement NFTs**. This reputation is **owned by the user**, is **verifiable on-chain**, and is **portable** across any platform that integrates with the system.

### Key Concepts Implemented

*   **Two-Contract Architecture**: A main contract handles the dynamic reputation logic, while a separate ERC721 contract issues achievement awards, creating a clean separation of concerns.
*   **Dynamic Balance**: The `balanceOf` function calculates a provider's reputation score in real-time based on their average rating, rather than storing it as a static value.
*   **Monthly Achievement NFTs**: High-performing providers (average score ≥ 4.9) can call the `claimMonthlyAchievement` function to mint a unique, timestamped NFT, gamifying excellence.
*   **Soulbound & Non-Transferable**: The reputation score itself cannot be transferred, ensuring it is earned, not bought. The achievement NFTs, however, are standard ERC721 tokens and can be showcased or transferred.

---

## How to Test the Full Ecosystem

You can test the entire workflow directly on Snowtrace.

1.  **Add a Rating:**
    *   Go to the **Main Reputation Contract's** "Write Contract" tab.
    *   Connect your wallet.
    *   Use the `addRating` function to give a test address a high average score (e.g., several 5-star ratings).

2.  **Claim the Achievement:**
    *   **Switch your MetaMask account** to the test address that received the high ratings.
    *   Call the `claimMonthlyAchievement` function from this account. The transaction will succeed.

3.  **Verify the NFT:**
    *   Go to the **Achievement NFT Contract's** page on Snowtrace.
    *   Use the `ownerOf` function in the "Read Contract" tab with `tokenId` 0. It will return the address of the service provider, proving the award was successfully minted to them.

## Next Steps

This prototype is a functional foundation. For a production-ready system, the next steps would be:
*   **Implement an Upgradable Contract using the Proxy Pattern:** To allow for future feature additions or bug fixes without requiring a full migration.
*   **Build a Full DApp Ecosystem:** Create dedicated interfaces for each user type (a rating portal for customers, a profile page for providers to view their score and claimed NFTs).
*   **Implement Strict Access Control:** The `addRating` function is currently public for demonstration. A real-world implementation would require a secure mechanism (e.g., proof-of-service receipts) to ensure only legitimate customers can submit ratings.
*   **Undergo a Professional Security Audit:** A full audit is essential before any mainnet deployment to ensure the safety and integrity of the system.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
