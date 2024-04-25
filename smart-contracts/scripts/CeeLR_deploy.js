 // scripts/CeeToken_deploy.js

const hre = require("hardhat");

async function main() {

  const factory = await hre.ethers.getContractFactory("CarbonMintLockedRecordNFT");

  console.log('Deploying CeeLRNFT...');
  const deployment = await factory.deploy();

  await deployment.deployed();
  console.log("CeeLR deployed to:", deployment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// GOERLI: CeeLR deployed to: 0x4f2a34c8c2B1B89144b6aF7B55671c01114e4811
// Mumbai: CeeLR deployed to: 0xbDC89bE5317b9694A5FaDe526e9B409cDEbb7339

