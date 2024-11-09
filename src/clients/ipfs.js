const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class IPFSClient {
  constructor() {
    this.gateway = config.ipfsGateway;
  }

  async cat(path) {
    try {
      const url = `${this.gateway}/ipfs/${path}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      logger.error('IPFS fetch error:', error);
      throw new Error(`Failed to fetch from IPFS: ${error.message}`);
    }
  }
}

module.exports = IPFSClient;