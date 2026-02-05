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
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');

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
app.use('/api/orders', require('./routes/demo.order.routes'));
app.use('/api/orders', require('./routes/demo.order.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    service: 'coconut-oil-api',
    endpoints: {
      admin: '/api/admin',
      products: '/api/products',
      orders: '/api/orders',
      health: '/api/health'
    },
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

// Demo order endpoint
app.get('/api/demo/order', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Order system demo',
    endpoints: {
      createOrder: 'POST /api/orders',
      getOrder: 'GET /api/orders/:id (use order number)',
      cancelOrder: 'PUT /api/orders/:id/cancel',
      adminGetAll: 'GET /api/orders (requires admin token)',
      adminUpdateStatus: 'PUT /api/orders/:id/status (requires admin token)',
      adminStats: 'GET /api/orders/stats/dashboard (requires admin token)'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
