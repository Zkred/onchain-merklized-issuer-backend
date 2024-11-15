const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { validateConfig } = require('./config/validation');
const database = require('./database');
const logger = require('./utils/logger');

// Debug log to show we're starting
console.log('[DEBUG] Starting application setup');

// Import routes - add explicit error handling
let routes;
try {
  routes = require('./routes');
  console.log('[DEBUG] Routes loaded successfully');
} catch (error) {
  console.error('[DEBUG] Failed to load routes:', error);
  process.exit(1);
}

// Validate configuration
validateConfig(config);

const app = express();

// Super early debug middleware to catch ALL requests
app.use((req, res, next) => {
  console.log('[DEBUG] Request received:', {
    method: req.method,
    url: req.url,
    path: req.path,
    timestamp: new Date().toISOString()
  });
  next();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes with explicit logging
console.log('[DEBUG] About to mount routes');
if (routes && typeof routes === 'function') {
  console.log('[DEBUG] Routes is a function - converting to router');
  app.use('/', routes);
} else if (routes && typeof routes.handle === 'function') {
  console.log('[DEBUG] Routes is a router - mounting directly');
  app.use('/', routes);
} else {
  console.error('[DEBUG] Routes is neither a function nor a router:', typeof routes);
  throw new Error('Invalid routes object');
}
console.log('[DEBUG] Routes mounted successfully');

// Add a test endpoint directly to app to verify base routing works
app.get('/test', (req, res) => {
  console.log('[DEBUG] Test endpoint hit');
  res.json({ message: 'Test endpoint working' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[DEBUG] Application error:', err);
  logger.error('Application error:', err);
  res.status(500).json({ error: err.message });
});

// Initialize database and start server
async function startServer() {
  try {
    await database.connect();
    
    const server = app.listen(config.port, () => {
      console.log('[DEBUG] Server started successfully');
      logger.info(`Server running on port ${config.port}`);
      logger.info(`External host: ${config.externalHost}`);
      
      // Log all registered routes for debugging
      console.log('\n[DEBUG] Registered Routes:');
      app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
          console.log(`[DEBUG] Route: ${r.route.path}`);
        }
      });
    });

  } catch (error) {
    console.error('[DEBUG] Failed to start server:', error);
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