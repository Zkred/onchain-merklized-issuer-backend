const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  logger.info({
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
  }, 'Incoming request');

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    }, 'Request completed');
  });

  next();
};

module.exports = {requestLogger};