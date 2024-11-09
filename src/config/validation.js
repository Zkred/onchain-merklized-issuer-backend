const { ERROR_MESSAGES } = require('./constants');

function validateConfig(config) {
  if (!config.supportedRPC || Object.keys(config.supportedRPC).length === 0) {
    throw new Error('No RPC endpoints configured');
  }

  if (!config.issuersPrivateKey) {
    throw new Error('Issuer private key not configured');
  }

  if (!config.blockchain.contractAddress || Object.keys(config.blockchain.contractAddress).length === 0) {
    throw new Error('Contract address not configured');
  }

  if (!config.database.url) {
    throw new Error('MongoDB connection string not configured');
  }

  return config;
}

module.exports = {
  validateConfig
};