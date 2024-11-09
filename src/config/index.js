require('dotenv').config();

// Get RPC endpoints from environment
const getRPCEndpoints = () => {
  const rpcString = process.env.SUPPORTED_RPC || '';
  const rpcPairs = rpcString.split(',');
  const rpcMap = {};
  
  rpcPairs.forEach(pair => {
      const [chainId, url] = pair.split('=');
      if (chainId && url) {
        rpcMap[chainId.trim()] = url.trim();
      }
    });
    
  return rpcMap;
};

// Get state contracts from environment
const getStateContracts = () => {
  const contractString = process.env.SUPPORTED_STATE_CONTRACTS || '';
  const contractPairs = contractString.split(',');
  const contractMap = {};
  
  contractPairs.forEach(pair => {
    const [chainId, address] = pair.split('=');
    if (chainId && address) {
      contractMap[chainId.trim()] = address.trim();
    }
  });
  
  return contractMap;
};

const config = {
  port: process.env.PORT || 3000,
  
  // RPC Configuration
  supportedRPC: getRPCEndpoints(),
  
  // Issuer Configuration
  issuersPrivateKey: process.env.ISSUERS_PRIVATE_KEY,
  
  // External Host
  externalHost: process.env.EXTERNAL_HOST,
  
  // IPFS Configuration
  ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io',
  
  // Database Configuration
  database: {
    url: process.env.MONGODB_CONNECTION_STRING,
    name: process.env.DATABASE_NAME || 'credentials'
  },
  
  // Blockchain Configuration
  blockchain: {
    networkId: process.env.NETWORK_ID || '80001', // Mumbai testnet by default
    contractAddress: getStateContracts()
  },
};

module.exports = config;