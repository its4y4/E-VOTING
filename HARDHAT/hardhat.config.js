require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    
    AlchemyNet: { 
      url: "https://eth-sepolia.g.alchemy.com/v2/rKL1zYfpGFlW_hCYB8clvMQ6DwAxg8bl",
      accounts: [process.env.PRIVATE_KEY1],
    }
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  /*sourcify: {
    enabled: true
  }*/
  };

  //0xd6fC64C57E67986100FB090Ba19915Ed1ea7C978