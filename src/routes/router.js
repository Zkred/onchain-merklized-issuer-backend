const express = require('express');
const { v4: uuidv4 } = require('uuid');
const requestIp = require('request-ip');
const { parseDID } = require('../middleware/parseDID');
const { requestLogger } = require('../middleware/requestLogger');
const systemHandler = require('../handlers/system');
const authenticationHandler = require('../handlers/authentication');
const iden3commHandler = require('../handlers/iden3comm');
const issuerHandler = require('../handlers/issuer');

console.log('[DEBUG] Loading router.js');

class Router {
  constructor() {
    console.log('[DEBUG] Creating new Router instance');
    this.router = express.Router();
    this.setupMiddleware();
    this.setupRoutes();
    console.log('[DEBUG] Router instance created');
  }

  setupMiddleware() {
    // Equivalent to chi middleware
    this.router.use((req, res, next) => {
      req.id = uuidv4(); // RequestID middleware
      next();
    });
    
    this.router.use(requestIp.mw()); // RealIP middleware
    this.router.use(requestLogger); // RequestLog middleware
    
    // Error recovery middleware
    this.router.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }


  setupRoutes() {
    this.setupBasicRoutes();
    this.setupAuthRoutes();
    this.setupAgentRoutes();
    this.setupApiRoutes();
  }

  setupBasicRoutes() {
    this.router.get('/readiness', systemHandler.readiness);
    this.router.get('/liveness', systemHandler.liveness);
  }

  setupAuthRoutes() {
    this.router.get('/api/v1/requests/auth', authenticationHandler.createAuthenticationRequest);
    this.router.post('/api/v1/callback', authenticationHandler.callback);
    this.router.get('/api/v1/status', authenticationHandler.authenticationRequestStatus);
  }

  setupAgentRoutes() {
    this.router.post('/api/v1/agent', iden3commHandler.agent);
  }

  setupApiRoutes() {
    this.router.get('/api/v1/issuers', issuerHandler.getIssuersList);

    // Group routes under /api/v1/identities/:identifier
    const identityRouter = express.Router({ mergeParams: true });
    
    // Apply parseDID middleware to all routes in this group
    identityRouter.use(parseDID);
    
    identityRouter.post('/claims', issuerHandler.createClaim);
    identityRouter.get('/claims', issuerHandler.getUserVCs);
    identityRouter.get('/claims/:claimId', issuerHandler.getUserVCByID);
    identityRouter.get('/claims/revocation/status/:nonce', issuerHandler.isRevokedClaim);
    identityRouter.get('/claims/offer', issuerHandler.getOffer);
    identityRouter.post('/claims/revoke/:nonce', issuerHandler.revokeClaim);

    this.router.use('/api/v1/identities/:identifier', identityRouter);
  }

  getRouter() {
    return this.router;
  }
}

const createRouter = () => {
  console.log('[DEBUG] Creating router via factory function');
  const router = new Router().getRouter();
  console.log('[DEBUG] Router created successfully');
  return router;
};

module.exports = createRouter;