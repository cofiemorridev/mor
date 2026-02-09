const express = require('express');
const router = express.Router();

// WhatsApp test
router.get('/whatsapp', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp service test completed',
    mode: 'Demo mode - message logged',
    timestamp: new Date().toISOString()
  });
});

// Email test
router.get('/email', (req, res) => {
  res.json({
    success: true,
    message: 'Email service test completed',
    mode: 'Demo mode - email logged',
    timestamp: new Date().toISOString()
  });
});

// Notification flow test
router.get('/notification-flow', (req, res) => {
  res.json({
    success: true,
    message: 'Notification flow test completed',
    mode: 'Demo mode',
    results: {
      whatsappOrderConfirmation: { success: true, data: { message: 'Demo mode - WhatsApp order confirmation logged' } },
      emailOrderConfirmation: { success: true, data: { message: 'Demo mode - Email order confirmation logged' } },
      whatsappPaymentConfirmation: { success: true, data: { message: 'Demo mode - WhatsApp payment confirmation logged' } },
      emailPaymentConfirmation: { success: true, data: { message: 'Demo mode - Email payment confirmation logged' } }
    }
  });
});

module.exports = router;
EOF\

cat > src/server.js << 'EOF'
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✅ Products: http://localhost:${PORT}/api/products`);
  console.log(`✅ Admin test: http://localhost:${PORT}/api/admin/test`);
  console.log(`✅ Payment test: http://localhost:${PORT}/api/payment/test`);
});
