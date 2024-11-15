const createRouter = require('./router');

console.log('[DEBUG] Initializing routes/index.js');
const router = createRouter();
console.log('[DEBUG] Router created');

module.exports = router;  // Export the router directly, not the factory function