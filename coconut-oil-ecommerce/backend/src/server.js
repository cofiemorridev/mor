const app = require('./app');
const { connectDB, isConnected } = require('./config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Connect to database (but don't block startup)
connectDB().then(() => {
  if (isConnected()) {
    console.log('✅ Database connection established');
  } else {
    console.warn('⚠️ Running without database connection. Admin features and data persistence will be limited.');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  
  if (!isConnected()) {
    console.log('⚠️  Warning: Running without database connection');
    console.log('   Using demo mode for testing.');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
