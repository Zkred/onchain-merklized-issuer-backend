const { ethers } = require('ethers');
const config = require('../config');
const logger = require('../utils/logger');
const DIDUtils = require('../utils/did');

class BlockchainClient {
  constructor(networkId) {
    this.networkId = networkId;
    this.provider = new ethers.JsonRpcProvider(config.supportedRPC[networkId]);

    const privateKey = DIDUtils.extractPrivateKey(config.issuersPrivateKey);

    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = config.blockchain.contractAddress[networkId];
  }

  async getContract(abi) {
    return new ethers.Contract(
      this.contractAddress,
      abi,
      this.wallet
    );
  }

  async getProvider() {
    return this.provider;
  }

  async getWallet() {
    return this.wallet;
  }
}

module.exports = BlockchainClient;