const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'PAYSTACK_SECRET_KEY',
  'PAYSTACK_PUBLIC_KEY',
  'FRONTEND_URL'
];

// Validate required environment variables
const validateEnv = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Running in development/demo mode');
    
    // Set defaults for missing required vars
    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/coconut_oil_ecommerce';
    }
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'development_jwt_secret_key_change_this_in_production';
    }
  }

  // Set defaults
  process.env.PORT = process.env.PORT || '5000';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  console.log('Environment configuration loaded');
};

module.exports = {
  validateEnv
};
