 // scripts/CeeToken_deploy.js

const {ethers} = require("hardhat");


async function deployCeeToken() {

  const factory = await ethers.getContractFactory("CeeToken");
  console.log('Deploying CeeToken...');
  const deployment = await factory.deploy('10000000000000000000000');

  await deployment.deployed();
  console.log("CeeToken deployed to:", deployment.address);
  return deployment.address;
}

async function main() {

  const tokenAddress = await deployCeeToken();

  const factory = await ethers.getContractFactory("EvidenceRecords");

  console.log('Deploying EvidenceRecord...');
  const deployment = await factory.deploy();

  await deployment.deployed();
  console.log("EvidenceRecord deployed to:", deployment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
smart-contracts git:(main) ✗ npx hardhat run scripts/CeeToken_and_EvidenceRecord_deploy.js --network goerli
Deploying CeeToken...
CeeToken deployed to: 0xDE6Ca053a126d9bE5827889d582C0242Cd001874
Deploying EvidenceRecord...
EvidenceRecord deployed to: 0xc3227E4b688513Fd19a17807d1cC1F4770FaFF8a

➜  smart-contracts git:(main) ✗ npx hardhat run scripts/CeeToken_and_EvidenceRecord_deploy.js --network mumbai
Deploying CeeToken...
CeeToken deployed to: 0x10D6F106eb28e9cD666cC1930C37B2a659FA32CF
Deploying EvidenceRecord...
EvidenceRecord deployed to: 0xf467e74c8e026F2A1a397eC66B42b0f35dFB4916

 * 
 */