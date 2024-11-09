const logger = require('../utils/logger');
const IssuerService = require('../services/issuer');

class IssuerHandler {
  constructor() {
    this.issuerService = new IssuerService();
  }

  async getIssuersList(req, res) {
    try {
      const issuers = await this.issuerService.getIssuers();
      res.json(issuers);
    } catch (error) {
      logger.error('Get issuers error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async createClaim(req, res) {
    try {
      const did = DIDUtils.processDID(req.did);
      const claim = await this.issuerService.createClaim(did, req.body);
      res.json(claim);
    } catch (error) {
      logger.error('Create claim error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getUserVCs(req, res) {
    try {
      const did = DIDUtils.processDID(req.did);
      const claims = await this.issuerService.getUserClaims(did);
      res.json(claims);
    } catch (error) {
      logger.error('Get user VCs error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getUserVCByID(req, res) {
    try {
      const did = DIDUtils.processDID(req.did);
      const { claimId } = req.params;
      const claim = await this.issuerService.getClaimById(did, claimId);
      res.json(claim);
    } catch (error) {
      logger.error('Get VC by ID error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async isRevokedClaim(req, res) {
    try {
      const { nonce } = req.params;
      const isRevoked = await this.issuerService.checkRevocationStatus(nonce);
      res.json({ isRevoked });
    } catch (error) {
      logger.error('Check revocation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getOffer(req, res) {
    try {
      const did = DIDUtils.processDID(req.did);
      const offer = await this.issuerService.generateOffer(did);
      res.json(offer);
    } catch (error) {
      logger.error('Get offer error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async revokeClaim(req, res) {
    try {
      const { nonce } = req.params;
      await this.issuerService.revokeClaim(nonce);
      res.json({ success: true });
    } catch (error) {
      logger.error('Revoke claim error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new IssuerHandler();