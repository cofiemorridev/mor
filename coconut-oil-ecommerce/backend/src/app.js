const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const errorMiddleware = require('./middleware/error.middleware');
const cacheMiddleware = require('./middleware/cache.middleware');

const app = express();

// Compression middleware (gzip)
app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "http://localhost:5000"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:5000", "https://api.paystack.co"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with aggressive caching
app.use('/uploads', 
  cacheMiddleware(86400), // 24 hours
  express.static(path.join(__dirname, '../uploads'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
  })
);

// Health check endpoint (no cache)
app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'coconut-oil-ecommerce-api',
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', cacheMiddleware(300), (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    performance: 'optimized'
  });
});

// Import and use routes with caching
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const testRoutes = require('./routes/test.routes');

// Apply caching to public routes
app.use('/api/products', cacheMiddleware(600), productRoutes); // 10 minutes
app.use('/api/payment/channels', cacheMiddleware(3600), paymentRoutes); // 1 hour
app.use('/api/test', cacheMiddleware(300), testRoutes); // 5 minutes

// Admin routes (no cache)
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check the API documentation for available endpoints'
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
