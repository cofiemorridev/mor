const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Coconut Oil E-commerce API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    demoMode: dbStatus === 'disconnected'
  });
});

// Demo products endpoint (works without DB)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    demoMode: true,
    products: [
      {
        id: 1,
        name: "Premium Virgin Coconut Oil",
        description: "Cold-pressed organic coconut oil",
        price: 25.99,
        image: "https://via.placeholder.com/300x200"
      },
      {
        id: 2,
        name: "Extra Virgin Coconut Oil",
        description: "Pure, unrefined coconut oil",
        price: 29.99,
        image: "https://via.placeholder.com/300x200"
      },
      {
        id: 3,
        name: "Coconut Oil Jar",
        description: "Coconut oil in glass jar",
        price: 34.99,
        image: "https://via.placeholder.com/300x200"
      }
    ]
  });
});

// Demo admin login (works without DB)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo credentials
  if (email === 'admin@coconutoil.com' && password === 'Admin123!') {
    res.json({
      success: true,
      message: 'Login successful (demo mode)',
      demoMode: true,
      token: 'demo-jwt-token-for-development',
      admin: {
        id: 'demo-admin-id',
        email: 'admin@coconutoil.com',
        name: 'Demo Admin',
        role: 'super-admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coconut_oil_ecommerce';

async function startServer() {
  try {
    console.log('🚀 Starting Coconut Oil Backend...');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Try to connect to MongoDB
    console.log('🔗 Attempting to connect to MongoDB...');
    
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected successfully');
    } catch (dbError) {
      console.log('⚠️ MongoDB connection failed, running in demo mode');
      console.log('   To enable database features:');
      console.log('   1. Install MongoDB: sudo apt-get install -y mongodb');
      console.log('   2. Or use MongoDB Atlas and update MONGODB_URI in .env');
      console.log('');
      console.log('ℹ️  Demo credentials: admin@coconutoil.com / Admin123!');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
      console.log(`🔐 Admin login: POST http://localhost:${PORT}/api/admin/login`);
      console.log('');
      console.log('========================================');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Start the server
startServer();
