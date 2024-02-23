require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'mumbai',
  networks: {
    // hardhat: {},
    // sepolia: {
    //   url: "https://eth-sepolia.g.alchemy.com/v2/RXh1mkGpx8p359wbOrm2vhVtjih2mPWY",
    //   accounts: ['0xe439ae6593376e149f0421f7ae7b3c777cc1da5e7d47923766f2e0f85030e723']
    // }
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/GJO0rvsoPVaTN58SP1JDV9Gw_jcCM8tK",
      accounts: ['0xea72f1a3c53fce4690a6484cc4f6bf66fbe3088fd2590e7c97e177a0f8933e8a']
    }
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
  sourcify: {
    enabled: true
  },
  etherscan: {
    
    // apiKey: 'KBJB6EM7K4YK1HZ9MXTUB3T6XADADC8FGX',
    apiKey: {
      polygonMumbai: 'P444IBQ8EJDNMDUH4QWANXT8K5USG9RX2S'
    }
  }
};
