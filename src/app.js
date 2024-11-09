const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { validateConfig } = require('./config/validation');
const database = require('./database');
const logger = require('./utils/logger');
const routes = require('./routes');

// Validate configuration
validateConfig(config);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).json({ error: err.message });
});

// Initialize database and start server
async function startServer() {
  try {
    await database.connect();
    
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`External host: ${config.externalHost}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await database.close();
  process.exit(0);
});