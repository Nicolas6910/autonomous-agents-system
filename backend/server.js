const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS middleware for cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Welcome endpoint - Returns a friendly welcome message
 * @route GET /welcome
 * @returns {Object} JSON response with welcome message and metadata
 */
app.get('/welcome', (req, res) => {
  try {
    const welcomeMessage = {
      message: "Bienvenue dans l'API de démonstration des agents autonomes !",
      timestamp: new Date().toISOString(),
      agent: "backend-expert",
      version: "1.0.0",
      status: "active",
      features: [
        "Endpoint welcome sécurisé",
        "Middleware de sécurité (helmet)",
        "Support CORS",
        "Logging des requêtes",
        "Gestion d'erreurs"
      ],
      endpoints: {
        welcome: "/welcome",
        health: "/health"
      }
    };

    res.status(200).json(welcomeMessage);
  } catch (error) {
    console.error('Error in welcome endpoint:', error);
    res.status(500).json({
      error: "Erreur interne du serveur",
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Health check endpoint
 * @route GET /health
 * @returns {Object} Server health status
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

/**
 * Root endpoint - API information
 * @route GET /
 * @returns {Object} API documentation
 */
app.get('/', (req, res) => {
  res.status(200).json({
    api: "Backend Welcome API",
    version: "1.0.0",
    description: "API de démonstration pour la collaboration d'agents autonomes",
    endpoints: {
      "/": "Documentation de l'API",
      "/welcome": "Message de bienvenue",
      "/health": "État de santé du serveur"
    },
    developer: "Backend Expert Agent"
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Endpoint non trouvé",
    message: `La route ${req.originalUrl} n'existe pas`,
    availableEndpoints: ["/", "/welcome", "/health"]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: "Erreur interne du serveur",
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend API démarrée sur le port ${PORT}`);
  console.log(`📍 Endpoint principal: http://localhost:${PORT}/welcome`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
});

module.exports = app;