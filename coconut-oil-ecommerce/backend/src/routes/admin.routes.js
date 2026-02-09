const express = require('express');
const router = express.Router();

// Public routes
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo authentication
  if (email === 'admin@coconutoil.com' && password === 'Admin123!') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'demo_jwt_token_' + Date.now(),
      admin: {
        id: 1,
        name: 'Admin User',
        email: 'admin@coconutoil.com',
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

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is working'
  });
});

module.exports = router;
