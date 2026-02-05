console.log("Testing product controller...");

try {
  const productController = require('./src/controllers/product.controller');
  console.log("✅ Product controller loaded successfully");
  console.log("Available functions:", Object.keys(productController));
  
  // Create mock request and response
  const mockReq = {
    query: {},
    params: {},
    body: {}
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
      console.log("Response:", JSON.stringify(data, null, 2));
      return this;
    }
  };
  
  // Test getAllProducts function
  console.log("\nTesting getAllProducts function...");
  productController.getAllProducts(mockReq, mockRes);
  
} catch (error) {
  console.error("❌ Error:", error.message);
}
