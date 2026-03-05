/**
 * PTNPedia Backend Server
 * Express server untuk mengatasi CORS dan proxy request ke SNPMB API
 * 
 * Usage:
 *   npm install express axios cheerio cors
 *   node server.js
 * 
 * API akan tersedia di: http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const { setupPTNPediaRoutes } = require('./src/ptnpedia-backend');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'OPTIONS'],
  credentials: false
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Setup PTNPedia routes
setupPTNPediaRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PTNPedia API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'PTNPedia API',
    version: '1.0.0',
    description: 'API untuk mengakses data PTN dari SNPMB',
    endpoints: {
      universities: '/api/ptnpedia/universities?type=snbp|snbt',
      programs: '/api/ptnpedia/programs/:code?type=snbp|snbt',
      health: '/api/ptnpedia/health',
      status: '/health'
    },
    documentation: 'https://github.com/your-repo/docs/PTNPEDIA_IMPLEMENTATION.md'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     PTNPedia API Server Started        ║
╠════════════════════════════════════════╣
║ Port: ${PORT}                              ║
║ Environment: ${process.env.NODE_ENV || 'development'}              ║
║ CORS: ${process.env.ALLOWED_ORIGINS || 'All origins'}         ║
╠════════════════════════════════════════╣
║ Endpoints:                             ║
║ • GET /                                ║
║ • GET /health                          ║
║ • GET /api/ptnpedia/universities       ║
║ • GET /api/ptnpedia/programs/:code     ║
║ • GET /api/ptnpedia/health             ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
