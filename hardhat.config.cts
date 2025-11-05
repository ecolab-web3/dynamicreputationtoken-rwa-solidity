import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Imports dotenv to load environment variables from .env file

// Load environment variables from the .env file
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // Configuration for the Avalanche Fuji testnet
    fuji: {
      url: process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: privateKey !== undefined ? [privateKey] : [],
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