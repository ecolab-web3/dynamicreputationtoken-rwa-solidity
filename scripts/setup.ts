// scripts/setup.ts
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("--- E-co.lab Dynamic Reputation Boilerplate Setup ---");
  console.log("This script will generate the multi-step deployment scripts for your project.");

  const network = await question("Which network will you deploy to? (e.g., fuji, avalancheMainnet) ");
  
  // --- Script 1: Deploy the NFT Contract ---
  const deployNFTScript = `
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ServicesReputationNFT with the account:", deployer.address);

  const NFT = await ethers.getContractFactory("ServicesReputationNFT");
  const nft = await NFT.deploy(deployer.address);
  await nft.waitForDeployment();
  
  const contractAddress = await nft.getAddress();
  console.log("✅ ServicesReputationNFT deployed to:", contractAddress);
  console.log("\\nNEXT: Copy this address and paste it into '02-deploy-reputation.ts'");
}
main().catch(e => { console.error(e); process.exit(1); });
`;
  fs.writeFileSync(path.join(__dirname, '01-deploy-nft.ts'), deployNFTScript.trim());
  console.log("\n✅ Successfully created `scripts/01-deploy-nft.ts`!");

  // --- Script 2: Deploy the Reputation Contract ---
  const deployReputationScript = `
import { ethers } from "hardhat";

async function main() {
  // <<< --- CONFIGURATION --- >>>
  const nftContractAddress = "PASTE_THE_NFT_CONTRACT_ADDRESS_HERE";
  // <<< --------------------- >>>

  if (!ethers.isAddress(nftContractAddress)) throw new Error("Invalid NFT contract address");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying DYNAMICREPUTATIONTOKEN_RWA with the account:", deployer.address);

  const Reputation = await ethers.getContractFactory("DYNAMICREPUTATIONTOKEN_RWA");
  const reputation = await Reputation.deploy(nftContractAddress);
  await reputation.waitForDeployment();

  const contractAddress = await reputation.getAddress();
  console.log("✅ DYNAMICREPUTATIONTOKEN_RWA deployed to:", contractAddress);
  console.log("\\nNEXT: Copy this address and paste it into '03-configure-permissions.ts'");
}
main().catch(e => { console.error(e); process.exit(1); });
`;
  fs.writeFileSync(path.join(__dirname, '02-deploy-reputation.ts'), deployReputationScript.trim());
  console.log("✅ Successfully created `scripts/02-deploy-reputation.ts`!");

  // --- Script 3: Configure Permissions ---
  const configureScript = `
import { ethers } from "hardhat";

async function main() {
  // <<< --- CONFIGURATION --- >>>
  const nftContractAddress = "PASTE_THE_NFT_CONTRACT_ADDRESS_HERE";
  const reputationContractAddress = "PASTE_THE_REPUTATION_CONTRACT_ADDRESS_HERE";
  // <<< --------------------- >>>

  if (!ethers.isAddress(nftContractAddress) || !ethers.isAddress(reputationContractAddress)) {
    throw new Error("Invalid contract addresses");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Configuring permissions with the account:", deployer.address);

  const NFT = await ethers.getContractFactory("ServicesReputationNFT");
  const nftContract = NFT.attach(nftContractAddress);
  
  console.log(\`Transferring ownership of ServicesReputationNFT to \${reputationContractAddress}...\`);
  
  const tx = await nftContract.transferOwnership(reputationContractAddress);
  await tx.wait();

  console.log("✅ Permissions configured successfully!");
  console.log("The system is now live and ready to be used.");
}
main().catch(e => { console.error(e); process.exit(1); });
`;
  fs.writeFileSync(path.join(__dirname, '03-configure-permissions.ts'), configureScript.trim());
  console.log("✅ Successfully created `scripts/03-configure-permissions.ts`!");
  
  console.log("\n--- Deployment Sequence ---");
  console.log(`1. Run: npx hardhat run scripts/01-deploy-nft.ts --network ${network}`);
  console.log(`2. Run: npx hardhat run scripts/02-deploy-reputation.ts --network ${network}`);
  console.log(`3. Run: npx hardhat run scripts/03-configure-permissions.ts --network ${network}`);
  
  rl.close();
}

main().catch(error => {
  console.error(error);
  rl.close();
  process.exitCode = 1;
});