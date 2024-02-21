require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    // hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/RXh1mkGpx8p359wbOrm2vhVtjih2mPWY",
      accounts: ['0xe439ae6593376e149f0421f7ae7b3c777cc1da5e7d47923766f2e0f85030e723']
    }
    // mumbai: {
    //   url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    //   accounts: ['0xe439ae6593376e149f0421f7ae7b3c777cc1da5e7d47923766f2e0f85030e723']
    // }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: 'KBJB6EM7K4YK1HZ9MXTUB3T6XADADC8FGX'
  }
};
