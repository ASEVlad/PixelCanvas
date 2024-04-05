import { ethers } from "hardhat";
import { PixelCanvas__factory } from "../typechain";

async function main() {
  const PRIVATE_KEY = "0x1f8da7873325b3035eeec198f15df21a5935cf8de568b344f78af7567c94a0a5"; // Replace with your wallet's private key
  const canvasWidth = 3840;
  const canvasHeight = 2160;

  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.era.zksync.io");

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Deployer address:", wallet.address);

  // Deploy PixelCanvas contract
  console.log("Deploying PixelCanvas contract...");
  const PixelCanvasFactory = (await ethers.getContractFactory(
    "PixelCanvas",
    wallet
  )) as PixelCanvas__factory;

  // Manually specify gas limit
  const gasLimit = 2000000; // Adjust this value as needed
  const overrides = {
    gasLimit: gasLimit,
  };

  const pixelCanvas = await PixelCanvasFactory.deploy(overrides);
  await pixelCanvas.deployed();
  console.log("PixelCanvas contract deployed at:", pixelCanvas.address);

  // Verify contract on zkSync mainnet explorer
  console.log("Verifying contract on zkSync mainnet explorer...");
  const result = await ethers.getContractAt("PixelCanvas", pixelCanvas.address);
  await result.deployTransaction.wait();
  console.log("Contract verified successfully.");

  // Log canvas dimensions
  console.log("Canvas dimensions:");
  console.log("Width:", canvasWidth);
  console.log("Height:", canvasHeight);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

