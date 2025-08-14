import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
const { ethers } = hre;
import { BaseContract } from "ethers";

describe("Reputation Ecosystem", function () {

  let reputationToken: BaseContract;
  let achievementNFT: BaseContract;
  let admin: any;
  let provider1: any;
  let customer1: any;

  // This hook runs before each `it` block
  beforeEach(async function () {
    [admin, provider1, customer1] = await ethers.getSigners();

    // 1. Deploy the NFT contract first
    const AchievementNFTFactory = await ethers.getContractFactory("ServicesReputationNFT");
    achievementNFT = await AchievementNFTFactory.deploy(admin.address);
    await achievementNFT.waitForDeployment();
    const nftAddress = await achievementNFT.getAddress();

    // 2. Deploy the main reputation contract, passing the NFT contract's address
    const ReputationTokenFactory = await ethers.getContractFactory("DYNAMICREPUTATIONTOKEN_RWA");
    reputationToken = await ReputationTokenFactory.deploy(nftAddress);
    await reputationToken.waitForDeployment();
    const tokenAddress = await reputationToken.getAddress();

    // 3. Transfer ownership of the NFT contract to the reputation contract
    await achievementNFT.connect(admin).transferOwnership(tokenAddress);
  });

  describe("Deployment and Setup", function () {
    it("Should set the correct names and symbols", async function () {
      expect(await reputationToken.name()).to.equal("E-co.lab Services Reputations");
      expect(await reputationToken.symbol()).to.equal("E-REP");
      expect(await achievementNFT.name()).to.equal("E-co.lab Services Achiever");
      expect(await achievementNFT.symbol()).to.equal("E-ACH");
    });

    it("Should set the reputation contract as the owner of the NFT contract", async function () {
      expect(await achievementNFT.owner()).to.equal(await reputationToken.getAddress());
    });
  });

  describe("Dynamic Reputation Logic", function () {
    it("Should start a provider with a balance of 0", async function () {
      expect(await reputationToken.balanceOf(provider1.address)).to.equal(0);
    });

    it("Should correctly calculate the average score after ratings", async function () {
      await reputationToken.connect(customer1).addRating(provider1.address, 5);
      expect(await reputationToken.balanceOf(provider1.address)).to.equal(500);

      await reputationToken.connect(customer1).addRating(provider1.address, 4);
      expect(await reputationToken.balanceOf(provider1.address)).to.equal(450); // (5+4)/2 * 100
    });
    
    it("Should revert if rating is outside the 1-5 range", async function () {
        await expect(reputationToken.connect(customer1).addRating(provider1.address, 0)).to.be.revertedWith("Rating must be between 1 and 5");
        await expect(reputationToken.connect(customer1).addRating(provider1.address, 6)).to.be.revertedWith("Rating must be between 1 and 5");
    });
  });

  describe("Achievement NFT Claiming", function () {
    it("Should prevent claiming if the score is too low", async function () {
      await reputationToken.connect(customer1).addRating(provider1.address, 4); // Score is 400
      await expect(reputationToken.connect(provider1).claimMonthlyAchievement())
        .to.be.revertedWith("Your reputation score is too low");
    });

    it("Should allow a provider with a high score to claim an achievement NFT", async function () {
      await reputationToken.connect(customer1).addRating(provider1.address, 5); // Score is 500
      
      await expect(reputationToken.connect(provider1).claimMonthlyAchievement())
        .to.not.be.reverted;

      expect(await achievementNFT.balanceOf(provider1.address)).to.equal(1);
      expect(await achievementNFT.ownerOf(0)).to.equal(provider1.address);
    });

    it("Should prevent claiming the same monthly award twice", async function () {
      await reputationToken.connect(customer1).addRating(provider1.address, 5);
      await reputationToken.connect(provider1).claimMonthlyAchievement(); // First claim
      
      await expect(reputationToken.connect(provider1).claimMonthlyAchievement())
        .to.be.revertedWith("This month's award has already been claimed");
    });
    
    it("Should format the vintage string correctly for double-digit months", async function () {
        // Fast-forward time to a date in November (a double-digit month)
        // Timestamp for Nov 15, 2025
        const novemberTimestamp = 1763222400;
        await time.setNextBlockTimestamp(novemberTimestamp);

        await reputationToken.connect(customer1).addRating(provider1.address, 5);
        await reputationToken.connect(provider1).claimMonthlyAchievement();

        const vintage = await achievementNFT.tokenVintage(0);
        expect(vintage).to.equal("2025-11");
    });
  });
  
  describe("Soulbound (Non-Transferable) Nature", function () {
    it("Should prevent transfer of reputation tokens", async function () {
      await expect(reputationToken.transfer(customer1.address, 100))
        .to.be.revertedWith("Reputation tokens are non-transferable");
    });

    it("Should prevent approval of reputation tokens", async function () {
      await expect(reputationToken.approve(customer1.address, 100))
        .to.be.revertedWith("Reputation tokens cannot be approved for transfer");
    });
  });
  
  describe("ServicesReputationNFT Security", function () {
    it("Should prevent a non-owner from calling awardAchievement", async function () {
        await expect(
            achievementNFT.connect(admin).awardAchievement(provider1.address, "2024-08")
        ).to.be.revertedWithCustomError(achievementNFT, "OwnableUnauthorizedAccount").withArgs(admin.address);
    });
  });
});