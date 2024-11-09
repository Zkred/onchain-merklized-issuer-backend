class SystemHandler {
  constructor() {}

  // Readiness check endpoint
  async readiness(req, res) {
    try {
      // Add any additional readiness checks here (e.g., database connection)
      return res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(503).json({
        status: 'not ready',
        error: error.message
      });
    }
  }

  // Liveness check endpoint
  async liveness(req, res) {
    try {
      return res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      return res.status(503).json({
        status: 'not alive',
        error: error.message
      });
    }
  }
}

module.exports = new SystemHandler();