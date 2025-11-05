import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Imports dotenv to load environment variables from .env file

import { task } from "hardhat/config";

task("setup", "Runs the interactive setup script for the project")
  .setAction(async () => {
    // Execute the setup script using node
    const { exec } = require("child_process");
    exec("ts-node scripts/setup.ts", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });
  });

// Load environment variables from the .env file
const FUJI_RPC_URL = process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // Configuration for the Avalanche Fuji testnet
    fuji: {
      url: FUJI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 43113,
    },
  },
  // Configuration for contract verification on the Snowtrace block explorer
  etherscan: {
    apiKey: {
      // For Snowtrace's free tier, a personal API key is not required.
      // However, the hardhat-verify plugin expects a non-empty string.
      avalancheFujiTestnet: "snowtrace", // A placeholder string is sufficient
    },
  },
};

export default config;