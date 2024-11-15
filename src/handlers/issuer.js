const logger = require('../utils/logger');
const IssuerService = require('../services/issuer');

const issuerHandler = {
  issuerService: new IssuerService(),

  getIssuersList: async (req, res) => {
    try {
      const issuers = await issuerHandler.issuerService.getIssuers();
      res.json(issuers);
    } catch (error) {
      logger.error('Get issuers error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  createClaim: async (req, res) => {
    try {
      const did = DIDUtils.processDID(req.did);
      const claim = await issuerHandler.issuerService.createClaim(did, req.body);
      res.json(claim);
    } catch (error) {
      logger.error('Create claim error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getUserVCs: async (req, res) => {
    try {
      const did = DIDUtils.processDID(req.did);
      const claims = await issuerHandler.issuerService.getUserClaims(did);
      res.json(claims);
    } catch (error) {
      logger.error('Get user VCs error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getUserVCByID: async (req, res) => {
    try {
      const did = DIDUtils.processDID(req.did);
      const { claimId } = req.params;
      const claim = await issuerHandler.issuerService.getClaimById(did, claimId);
      res.json(claim);
    } catch (error) {
      logger.error('Get VC by ID error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  isRevokedClaim: async (req, res) => {
    try {
      const { nonce } = req.params;
      const isRevoked = await issuerHandler.issuerService.checkRevocationStatus(nonce);
      res.json({ isRevoked });
    } catch (error) {
      logger.error('Check revocation error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getOffer: async (req, res) => {
    try {
      const did = DIDUtils.processDID(req.did);
      const offer = await issuerHandler.issuerService.generateOffer(did);
      res.json(offer);
    } catch (error) {
      logger.error('Get offer error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  revokeClaim: async (req, res) => {
    try {
      const { nonce } = req.params;
      await issuerHandler.issuerService.revokeClaim(nonce);
      res.json({ success: true });
    } catch (error) {
      logger.error('Revoke claim error:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = issuerHandler;