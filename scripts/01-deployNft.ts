const { ethers } = require("hardhat");
async function main() {
const [deployer] = await ethers.getSigners();
console.log("Step 1: Deploying ServicesReputationNFT with account:", deployer.address);
const NFT = await ethers.getContractFactory("ServicesReputationNFT");
const nft = await NFT.deploy(deployer.address);
await nft.waitForDeployment();
const nftAddress = await nft.getAddress();
console.log("✅ ServicesReputationNFT deployed to:", nftAddress);
console.log("\nACTION: Copy this address for the next step.");

console.log("\nTo verify on Fuji, run:");
console.log(`npx hardhat verify --network fuji ${contractAddress} "${deployer.address}"`);
}
main().catch(e => { console.error(e); process.exit(1); });