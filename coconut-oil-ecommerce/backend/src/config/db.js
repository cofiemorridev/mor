const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas if available, otherwise use local or mock
    let mongoURI = process.env.MONGODB_URI;
    
    // If no URI provided, try local MongoDB
    if (!mongoURI || mongoURI.includes('localhost')) {
      mongoURI = 'mongodb://localhost:27017/coconut_oil_ecommerce';
      console.log('Using local MongoDB:', mongoURI);
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Don't exit in development - allow the app to run with limited functionality
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️ Running in development mode without database. Some features will be limited.');
      console.log('   Using demo mode for testing.');
      return null;
    }
  }
};

// Function to check if database is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isConnected };
