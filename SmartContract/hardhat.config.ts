import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = "ea55d7d6828b44419bada0fc4307fb49"; // Replace with your Infura API key
const PRIVATE_KEY = "0x1f8da7873325b3035eeec198f15df21a5935cf8de568b344f78af7567c94a0a5"; // Replace with your wallet's private key

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    arbitrumMainnet: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [PRIVATE_KEY]
    },

    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
      accounts: [PRIVATE_KEY]
    }

  }
  // Other configuration options...
};

export default config;
