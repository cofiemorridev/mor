const express = require('express');
const router = express.Router();

// Test payment endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment API is working',
    currency: 'GHS (Ghana Cedis)',
    test_mode: true,
    timestamp: new Date().toISOString()
  });
});

// Get supported payment channels
router.get('/channels', (req, res) => {
  res.json({
    success: true,
    data: {
      mobile_money: [
        { id: 'mtn', name: 'MTN Mobile Money', icon: '📱' },
        { id: 'vodafone', name: 'Vodafone Cash', icon: '💸' },
        { id: 'airteltigo', name: 'AirtelTigo Money', icon: '📲' }
      ],
      card: [
        { id: 'visa', name: 'Visa', icon: '💳' },
        { id: 'mastercard', name: 'Mastercard', icon: '💳' },
        { id: 'verve', name: 'Verve', icon: '💳' }
      ],
      bank_transfer: [
        { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
      ]
    }
  });
});

// Initialize payment
router.post('/initialize', (req, res) => {
  const { orderId, email, amount } = req.body;
  
  res.json({
    success: true,
    message: 'Payment initialized successfully',
    data: {
      authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/test`,
      reference: 'DEMO_' + Date.now(),
      access_code: 'demo_access_code'
    }
  });
});

// Verify payment
router.get('/verify/:reference', (req, res) => {
  res.json({
    success: true,
    message: 'Payment verified',
    data: {
      reference: req.params.reference,
      status: 'success',
      amount: 250000, // 2500 GHS in kobo
      currency: 'GHS',
      channel: 'mobile_money',
      paid_at: new Date().toISOString()
    }
  });
});

module.exports = router;
