# Dynamic Reputation Token as a Real-World Asset (RWA)

![Language](https://img.shields.io/badge/Language-Solidity-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche_Fuji-red)
![Verified Contract](https://img.shields.io/badge/Contract-Verified-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Solidity Version](https://img.shields.io/badge/Solidity-0.8.20-yellow.svg)
![Framework](https://img.shields.io/badge/Framework-Hardhat-purple.svg)

___

## About The Project

This repository contains a smart contract ecosystem that tokenizes **user reputation** as a dynamic, non-transferable Real-World Asset (RWA). It's designed to solve the problem of platform-locked reputation in the gig economy, freelancer marketplaces, and other service-based platforms.

This project has been successfully migrated to a professional **Hardhat environment**, rigorously tested, deployed, and verified on the **Avalanche Fuji Testnet**.

___

## Live Interaction & DApps

Please make sure your wallet (e.g., MetaMask) is connected to the **Avalanche Fuji Testnet** to interact with the project components.

### DApp Prototypes

*   **Rating Portal (for Customers):** This interface allows a customer to submit a rating for a service provider, which directly impacts their on-chain reputation.
    *   **[➡️ Access the Rating Portal (english version)](https://ecolab-web3.github.io/dynamicreputationtoken-rwa-solidity/rating_portal-en.html)**
    *   **[➡️ Acesse o Portal de Avaliação (versão em português)](https://ecolab-web3.github.io/dynamicreputationtoken-rwa-solidity/rating_portal-pt_br.html)**

*   **Provider Dashboard:** This dashboard allows service providers to view their dynamic reputation score and claim their monthly achievement NFTs.
    *   **[➡️ Access the Provider Dashboard (english version)](https://ecolab-web3.github.io/dynamicreputationtoken-rwa-solidity/provider_dashboard-en.html)**
    *   **[➡️ Acesse o Painel do Prestador (versão em português)](https://ecolab-web3.github.io/dynamicreputationtoken-rwa-solidity/provider_dashboard-pt_br.html)**

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

## Development Environment & Testing

This project was migrated from Remix IDE to a professional Hardhat environment to ensure quality and reproducibility.

*   **Framework:** Hardhat
*   **Solidity Version:** `0.8.20`
*   **Testing:** A comprehensive test suite was developed using `ethers.js` and `Chai`. The suite consists of **12 passing tests** covering the entire ecosystem.

### Test Coverage

The project achieved the highest possible practical test coverage across its two contracts.

| File                              | % Stmts | % Branch | % Funcs | % Lines |
|-----------------------------------|---------|----------|---------|---------|
| DYNAMICREPUTATIONTOKEN_RWA.sol    | 96.30   | 91.67    | 100     | 100     |
| SERVICESREPUTATIONNFT_RWA.sol     | 100     | 100      | 100     | 100     |
| **All files**                     | 96.55   | 92.86    | 100     | 100     |

**Note on Code Coverage:** The coverage tool correctly identifies a logical branch related to division-by-zero that is not covered in `DYNAMICREPUTATIONTOKEN_RWA.sol`. This is intentional and a feature of the code's safety. The contract includes an explicit check `if (providerReputation.ratingCount == 0)` which prevents the division from ever occurring. This makes the compiler's built-in "Panic" error for division-by-zero unreachable. Therefore, while the coverage is not a perfect 100%, the test suite fully covers all reachable logic paths in the contract.

---

## Overview

The core idea is to transform a service provider's reputation into a **Soulbound Token (SBT)** whose balance dynamically reflects their real-world service quality. High performance is further rewarded with unique, collectible **Achievement NFTs**. This reputation is **owned by the user**, is **verifiable on-chain**, and is **portable** across any platform that integrates with the system.

### Key Concepts Implemented

*   **Two-Contract Architecture**: A main contract handles the dynamic reputation logic, while a separate ERC721 contract issues achievement awards.
*   **Dynamic Balance**: The `balanceOf` function calculates a provider's reputation score in real-time based on their average rating.
*   **Monthly Achievement NFTs**: High-performing providers (average score ≥ 4.9) can call the `claimMonthlyAchievement` function to mint a unique, timestamped NFT.
*   **Soulbound & Non-Transferable**: The reputation score itself cannot be transferred, ensuring it is earned, not bought.

---

## Next Steps

This prototype is a functional foundation. For a production-ready system, the next steps focus on usability, data integrity, and security.

### 1. Implement an Upgradable Contract using the Proxy Pattern

To allow for future feature additions or bug fixes without requiring a full migration, the next logical step is to implement an upgradable contract using OpenZeppelin's Upgrades Contracts.

### 2. Enhance the DApp Ecosystem

The current DApps are functional prototypes. A production version would require enhancing them with a modern framework and adding features:
*   **Enhance Rating Portal:** Improve user feedback with modals and notifications.
*   **Enhance Provider Dashboard:** Add features like a gallery to showcase the achievement NFTs and a detailed history of ratings received.

### 3. Implement Strict Access Control for Ratings

The `addRating` function is currently public for demonstration. A real-world implementation would require a secure mechanism (e.g., using signed messages, or NFT-based "proof-of-service" receipts) to ensure only legitimate customers can submit ratings, preventing spam and manipulation.

### 4. Undergo a Professional Security Audit

Before any mainnet deployment, a full audit by a reputable third-party security firm is essential to ensure the safety and integrity of the system.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.