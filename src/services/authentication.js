const { auth } = require('@iden3/js-iden3-auth');
const logger = require('../utils/logger');

class AuthenticationService {
  constructor() {
    this.sessions = new Map();
  }

  async createAuthRequest() {
    try {
      const authRequest = auth.createAuthorizationRequest(
        'test flow',
        'did:iden3:polygon:mumbai:x7', // Replace with your issuer DID
        process.env.CALLBACK_URL
      );

      const sessionId = authRequest.id;
      this.sessions.set(sessionId, { status: 'pending' });

      return authRequest;
    } catch (error) {
      logger.error('Create auth request error:', error);
      throw error;
    }
  }

  async handleCallback(token) {
    try {
      const authResponse = await auth.verifyAuthResponse(token);
      
      if (authResponse.valid) {
        const sessionId = authResponse.id;
        this.sessions.set(sessionId, { 
          status: 'completed',
          did: authResponse.from
        });
        
        return { success: true };
      }
      
      throw new Error('Invalid authentication response');
    } catch (error) {
      logger.error('Handle callback error:', error);
      throw error;
    }
  }

  async getAuthStatus(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
}

module.exports = AuthenticationService;