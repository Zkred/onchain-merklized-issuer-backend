const logger = require('../utils/logger');
const AuthenticationService = require('../services/authentication');

class AuthenticationHandler {
  constructor() {
    this.authService = new AuthenticationService();
  }

  async createAuthenticationRequest(req, res) {
    try {
      const authRequest = await this.authService.createAuthRequest();
      res.json(authRequest);
    } catch (error) {
      logger.error('Create auth request error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async callback(req, res) {
    try {
      const { token } = req.body;
      const result = await this.authService.handleCallback(token);
      res.json(result);
    } catch (error) {
      logger.error('Callback error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async authenticationRequestStatus(req, res) {
    try {
      const { sessionId } = req.query;
      const status = await this.authService.getAuthStatus(sessionId);
      res.json(status);
    } catch (error) {
      logger.error('Auth status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthenticationHandler();
