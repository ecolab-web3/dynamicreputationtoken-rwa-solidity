const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const nftContractAddress = "PASTE_THE_NFT_CONTRACT_ADDRESS_FROM_STEP_1_HERE";

  if (!ethers.isAddress(nftContractAddress)) throw new Error("Invalid NFT address. Please edit `02-deploy-reputation.ts`.");

  console.log("Step 2: Deploying DYNAMICREPUTATIONTOKEN_RWA with account:", deployer.address);

  const Reputation = await ethers.getContractFactory("DYNAMICREPUTATIONTOKEN_RWA");
  const reputation = await Reputation.deploy(nftContractAddress);
  await reputation.waitForDeployment();

  const reputationAddress = await reputation.getAddress();
  console.log("✅ DYNAMICREPUTATIONTOKEN_RWA deployed to:", reputationAddress);
  console.log("\nACTION: Copy both contract addresses for the next step.");

  console.log("\nTo verify on Fuji, run:");
  console.log(`npx hardhat verify --network fuji ${contractAddress} "${deployer.address}"`);
}
main().catch(e => { console.error(e); process.exit(1); });