const { ethers } = require("hardhat");

async function main() {
  const nftContractAddress = "PASTE_THE_NFT_CONTRACT_ADDRESS_FROM_STEP_1_HERE";
  const reputationContractAddress = "PASTE_THE_REPUTATION_CONTRACT_ADDRESS_FROM_STEP_2_HERE";

  if (!ethers.isAddress(nftContractAddress) || !ethers.isAddress(reputationContractAddress)) {
    throw new Error("Invalid addresses. Please edit `03-configure-permissions.ts`.");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Step 3: Configuring permissions with account:", deployer.address);

  const NFT = await ethers.getContractFactory("ServicesReputationNFT");
  const nftContract = NFT.attach(nftContractAddress);
  
  console.log(`Transferring ownership of the NFT contract to the Reputation contract...`);
  
  const tx = await nftContract.transferOwnership(reputationContractAddress);
  await tx.wait();

  console.log("✅ Permissions configured successfully! The system is now live.");
}
main().catch(e => { console.error(e); process.exit(1); });