// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Compile the contract
  await hre.run("compile");

  // Deploy the contract on zkSync Era
  const ContractDeployer = await hre.ethers.getContractFactory("ContractDeployer");
  const contractDeployer = await ContractDeployer.deploy();

  await contractDeployer.deployed();

  console.log("ContractDeployer deployed to:", contractDeployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
