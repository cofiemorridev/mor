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
  'FRONTEND_URL',
  'PAYSTACK_SECRET_KEY',
  'PAYSTACK_PUBLIC_KEY',
  'WHATSAPP_API_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'ADMIN_WHATSAPP_NUMBER',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM'
];

// Validate required environment variables
const validateEnv = () => {
  console.log('Validating environment variables...');
  
  // Set defaults
  process.env.PORT = process.env.PORT || '5000';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  // Check required variables (but don't exit in development)
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting because required environment variables are missing');
      process.exit(1);
    } else {
      console.log('Running in development mode with default values');
      
      // Set defaults for development
      if (!process.env.MONGODB_URI) {
        process.env.MONGODB_URI = 'mongodb://localhost:27017/coconut_oil_ecommerce';
      }
      if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'development_jwt_secret_key_change_this_in_production';
      }
    }
  }
  
  console.log('Environment validation complete');
};

// Helper to get environment variables
const get = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

module.exports = {
  validateEnv,
  get
};
