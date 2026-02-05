const express = require('express');
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentChannels,
  validateMobileMoneyNumber,
  getBanks,
  testPayment
} = require('../controllers/payment.controller');

// Public routes
router.get('/test', testPayment);
router.get('/channels', getPaymentChannels);
router.get('/banks', getBanks);
router.post('/validate-mobile-money', validateMobileMoneyNumber);
router.post('/initialize', initializePayment);
router.get('/verify/:reference', verifyPayment);

// Webhook route (no CSRF protection needed)
router.post('/webhook', handleWebhook);

module.exports = router;
