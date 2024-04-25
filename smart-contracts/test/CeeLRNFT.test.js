const { expect } = require("chai");
import { ethers } from "hardhat";

describe("CeeLR NFT", function () {
  it("Should return the right name and symbol", async function () {
    const CeeLR = await ethers.getContractFactory("CarbonMintLockedRecordNFT");
    const contract = await CeeLR.deploy()

    await contract.deployed();
    expect(await contract.name()).to.equal("CarbonMintLockedRecordNFT");
    expect(await contract.symbol()).to.equal("CeeLR");
  });
});
