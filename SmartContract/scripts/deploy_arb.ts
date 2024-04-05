import { ethers } from 'hardhat';
import { PixelCanvas__factory } from '../typechain';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const PixelCanvasFactory = (await ethers.getContractFactory(
    'PixelCanvas',
    deployer
  )) as PixelCanvas__factory;

  // Deploy PixelCanvas contract
  const pixelCanvas = await PixelCanvasFactory.deploy();
  await pixelCanvas.deployed();

  console.log('PixelCanvas deployed to:', pixelCanvas.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

