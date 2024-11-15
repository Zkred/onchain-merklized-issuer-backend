const logger = require('./logger');

class DIDUtils {
  /**
   * Processes multiple DIDs from environment variable
   * @param {string} didsString - Comma separated DIDs string
   * @returns {string[]} - Array of processed DIDs
   */
  static processDIDs(didsString) {
    try {
      if (!didsString) {
        return [];
      }

      return didsString
        .split(',')
        .map(did => did.trim())
        .filter(did => did)
        .map(did => {
          const parts = did.split('=');
          // Return just the DID part without the private key
          return parts[0];
        });
    } catch (error) {
      logger.error('Error processing multiple DIDs:', error);
      throw new Error('Invalid DIDs format');
    }
  }

  /**
   * Extracts private key from a DID string
   * @param {string} did - The DID containing private key
   * @returns {string} - The extracted private key
   */
  static extractPrivateKey(did) {
    try {
      if (!did) {
        throw new Error('DID is required');
      }

      // Split by '=' and get the last part
      const parts = did.split('=');
      if (parts.length !== 2) {
        throw new Error('Invalid DID format: missing private key');
      }

      const privateKey = parts[1];
      
      // Validate if it's a valid hex string
      if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
        throw new Error('Invalid private key format');
      }

      // Return with '0x' prefix for ethereum compatibility
      return `0x${privateKey}`;
    } catch (error) {
      logger.error('Error extracting private key from DID:', error);
      throw new Error('Unable to extract private key from DID');
    }
  }

  /**
   * Validates if a string is a valid DID format
   * @param {string} did - The DID to validate
   * @returns {boolean} - Whether the DID is valid
   */
  static isValidDID(did) {
    try {
      if (!did) return false;
      
      // Basic DID format validation
      const didRegex = /^(did:iden3:(polygon|mumbai|main|test):[\w-]+)$/;
      return didRegex.test(did);
    } catch (error) {
      logger.error('Error validating DID:', error);
      return false;
    }
  }

  /**
   * Formats a DID into the standard format
   * @param {string} identifier - The DID identifier
   * @param {string} network - The network (polygon, mumbai, etc.)
   * @returns {string} - The formatted DID
   */
  static formatDID(identifier, network = 'polygon') {
    try {
      const cleanIdentifier = this.processDID(identifier);
      return `did:iden3:${network}:${cleanIdentifier}`;
    } catch (error) {
      logger.error('Error formatting DID:', error);
      throw new Error('Unable to format DID');
    }
  }

  /**
   * Extracts network information from a DID
   * @param {string} did - The DID to process
   * @returns {string} - The network identifier
   */
  static extractNetwork(did) {
    try {
      if (!this.isValidDID(did)) {
        throw new Error('Invalid DID format');
      }
      
      const parts = did.split(':');
      return parts[2]; // Returns 'polygon', 'mumbai', etc.
    } catch (error) {
      logger.error('Error extracting network from DID:', error);
      throw new Error('Unable to extract network from DID');
    }
  }
}

module.exports = DIDUtils;