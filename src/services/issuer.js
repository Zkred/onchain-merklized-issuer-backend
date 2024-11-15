const { ethers } = require('ethers');
const logger = require('../utils/logger');
const BlockchainClient = require('../clients/blockchain');
const IPFSClient = require('../clients/ipfs');
const CredentialRepository = require('../repository/credential');
const { ERROR_MESSAGES } = require('../config/constants');
const config = require('../config');
const DIDUtils = require('../utils/did');

class IssuerService {
  constructor() {
    this.blockchainClients = {};
    this.ipfsClient = new IPFSClient();
    this.credentialRepository = new CredentialRepository();
    this.dids = []
    this.initializeBlockchainClients();
    this.initializeIssuers();
  }

  initializeIssuers() {
    try {
      // Initialize with the issuer's private key from config
      if (config.issuersPrivateKey) {
        const dids = DIDUtils.processDIDs(config.issuersPrivateKey);
        this.dids.push(...dids);
      }
    } catch (error) {
      logger.error('Failed to initialize issuers:', error);
      throw new Error(ERROR_MESSAGES.INITIALIZATION_ERROR);
    }
  }

  initializeBlockchainClients() {
    try {
      // Initialize blockchain clients for each supported network
      Object.keys(config.supportedRPC).forEach((networkId) => {
        this.blockchainClients[networkId] = new BlockchainClient(networkId);
      });
    } catch (error) {
      logger.error('Failed to initialize blockchain clients:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

    /**
   * Get list of all issuer addresses
   * @returns {string[]} Array of issuer addresses
   */
    async getIssuers() {
      try {
        // Convert Map keys to array, similar to Go implementation
        const issuers = this.dids;
        logger.info(`Retrieved ${issuers.length} issuers`);
        return issuers;
      } catch (error) {
        logger.error('Get issuers error:', error);
        throw error;
      }
    }

  async getUserCredentials(issuerDID, subject, schemaType) {
    try {
      return await this.credentialRepository.getByUser(
        issuerDID.string(),
        subject,
        schemaType
      );
    } catch (error) {
      logger.error('Get user credentials error:', error);
      throw error;
    }
  }

  async getCredentialByID(issuerDID, credentialID) {
    try {
      return await this.credentialRepository.getByID(
        issuerDID.string(),
        credentialID
      );
    } catch (error) {
      logger.error('Get credential by ID error:', error);
      throw error;
    }
  }

  async issueCredential(issuerDID, credentialRequest) {
    try {
      // Validate request
      if (!credentialRequest.credentialSchema) {
        throw new Error(ERROR_MESSAGES.INVALID_SCHEMA);
      }

      // Get blockchain client for the issuer's network
      const networkId = issuerDID.getNetworkId();
      const blockchainClient = this.blockchainClients[networkId];

      if (!blockchainClient) {
        throw new Error(`No blockchain client for network ${networkId}`);
      }

      // Fetch schema (from IPFS or HTTP)
      const schema = await this.fetchSchema(credentialRequest.credentialSchema);

      // Create credential
      const credential = await this.createVerifiableCredential(
        issuerDID,
        credentialRequest,
        schema
      );

      // Process claim
      const coreClaim = await this.processCoreClaim(credential, credentialRequest);

      // Issue on chain
      const contract = await blockchainClient.getContract([
        'function addClaim(uint256 hi, uint256 ht)'
      ]);

      const tx = await this.publishClaimOnChain(
        contract,
        coreClaim
      );
      await tx.wait();

      // Generate MTP proof
      const mtpProof = await this.generateMTPProof(
        blockchainClient,
        coreClaim,
        issuerDID
      );

      // Add proof to credential
      credential.proof = [mtpProof];

      // Store in repository
      const id = await this.credentialRepository.create(credential);

      return id;
    } catch (error) {
      logger.error('Issue credential error:', error);
      throw error;
    }
  }

  async fetchSchema(schemaUrl) {
    try {
      const url = new URL(schemaUrl);
      if (url.protocol === 'ipfs:') {
        return await this.ipfsClient.cat(url.host);
      } else if (url.protocol === 'http:' || url.protocol === 'https:') {
        const response = await axios.get(schemaUrl);
        return response.data;
      }
      throw new Error(ERROR_MESSAGES.INVALID_SCHEMA);
    } catch (error) {
      logger.error('Fetch schema error:', error);
      throw error;
    }
  }
  async revokeCredential(issuerDID, nonce) {
    try {
      const networkId = issuerDID.getNetworkId();
      const blockchainClient = this.blockchainClients[networkId];
      if (!blockchainClient) {
        throw new Error(`No blockchain client for network ${networkId}`);
      }
      const contract = await blockchainClient.getContract([
        'function revoke(uint64)'
      ]);
      const tx = await contract.revoke(nonce);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      logger.error('Revoke credential error:', error);
      throw error;
    }
  }

  async createClaim(did, claimData) {
    try {
      // Create and sign the claim
      const claim = await this.generateClaim(did, claimData);

      // Store the claim on-chain
      const tx = await this.publishClaim(claim);
      await tx.wait();

      return claim;
    } catch (error) {
      logger.error('Create claim error:', error);
      throw error;
    }
  }

  async getUserClaims(did) {
    try {
      // Implement claim retrieval logic
      return [];
    } catch (error) {
      logger.error('Get claims error:', error);
      throw error;
    }
  }

  async getClaimById(did, claimId) {
    try {
      // Implement single claim retrieval logic
      return {};
    } catch (error) {
      logger.error('Get claim by ID error:', error);
      throw error;
    }
  }

  async checkRevocationStatus(nonce) {
    try {
      // Implement revocation check logic
      return false;
    } catch (error) {
      logger.error('Check revocation error:', error);
      throw error;
    }
  }

  async generateOffer(did) {
    try {
      // Implement offer generation logic
      return {};
    } catch (error) {
      logger.error('Generate offer error:', error);
      throw error;
    }
  }

  async revokeClaim(nonce) {
    try {
      // Implement claim revocation logic
      const tx = await this.sendRevocationTx(nonce);
      await tx.wait();
    } catch (error) {
      logger.error('Revoke claim error:', error);
      throw error;
    }
  }

  // Helper methods
  async generateClaim(did, data) {
    // Implement claim generation logic
  }

  async publishClaim(claim) {
    // Implement on-chain publishing logic
  }

  async sendRevocationTx(nonce) {
    // Implement revocation transaction logic
  }
}

module.exports = IssuerService;