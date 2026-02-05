const express = require('express');
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import configurations
const { validateEnv } = require('./config/env');

// Import middleware
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Import routes
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');

// Initialize app
const app = express();

// Validate environment variables
validateEnv();

// Security middleware
app.use(helmet());

// CORS - allow all origins in development
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    service: 'coconut-oil-api',
    demoMode: true
  });
});

// Test endpoint for demo
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
