console.log("Testing admin controller...");

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test_jwt_secret_123';
process.env.JWT_EXPIRE = '30d';

try {
  const adminController = require('./src/controllers/admin.controller');
  console.log("✅ Admin controller loaded successfully");
  console.log("Available functions:", Object.keys(adminController));
  
  // Create mock request and response
  const mockReq = {
    body: {
      email: 'admin@coconutoil.com',
      password: 'Admin123!'
    }
  };
  
  const mockRes = {
    statusCode: null,
    responseData: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.responseData = data;
      console.log("Login response:", JSON.stringify(data, null, 2));
      return this;
    }
  };
  
  // Test login function
  console.log("\nTesting login function...");
  adminController.login(mockReq, mockRes);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}
