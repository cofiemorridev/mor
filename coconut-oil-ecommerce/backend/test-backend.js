const express = require('express');
const app = express();
app.use(express.json());

// Test the controllers directly
console.log("Testing controller imports...\n");

try {
  // Test product controller
  const productController = require('./src/controllers/product.controller');
  console.log("✅ Product controller loaded");
  console.log("   Exports:", Object.keys(productController));
  
  // Test each function
  const mockReq = { query: {}, params: {}, body: {} };
  const mockRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.responseData = data;
      console.log("   Response:", JSON.stringify(data).substring(0, 100) + "...");
      return this;
    }
  };
  
  console.log("\nTesting getAllProducts:");
  productController.getAllProducts(mockReq, mockRes);
  
  console.log("\nTesting getFeaturedProducts:");
  productController.getFeaturedProducts(mockReq, mockRes);
  
} catch (error) {
  console.error("❌ Error loading product controller:", error.message);
}

console.log("\n---\n");

try {
  // Test admin controller
  const adminController = require('./src/controllers/admin.controller');
  console.log("✅ Admin controller loaded");
  console.log("   Exports:", Object.keys(adminController));
  
  // Test login function
  const mockReq = { 
    body: { 
      email: 'admin@coconutoil.com', 
      password: 'Admin123!' 
    } 
  };
  const mockRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.responseData = data;
      console.log("   Login response:", JSON.stringify(data).substring(0, 100) + "...");
      if (data.token) {
        console.log("   ✅ Token received!");
      }
      return this;
    }
  };
  
  console.log("\nTesting admin login:");
  adminController.login(mockReq, mockRes);
  
} catch (error) {
  console.error("❌ Error loading admin controller:", error.message);
}

console.log("\n=== All tests completed ===");
