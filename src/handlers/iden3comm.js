const logger = require('../utils/logger');
const Iden3commService = require('../services/iden3comm');

class Iden3commHandler {
  constructor() {
    this.iden3commService = new Iden3commService();
  }

  async agent(req, res) {
    try {
      const message = req.body;
      const response = await this.iden3commService.handleMessage(message);
      res.json(response);
    } catch (error) {
      logger.error('Agent error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new Iden3commHandler();
