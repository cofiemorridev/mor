const express = require('express');
const router = express.Router();
const WhatsAppService = require('../services/whatsapp.service');
const EmailService = require('../services/email.service');

/**
 * Test WhatsApp service
 */
router.get('/whatsapp', async (req, res) => {
  try {
    // Test WhatsApp service
    const result = await WhatsAppService.sendMessage(
      '+233241234567',
      'test_template',
      'en',
      [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Test User' },
            { type: 'text', text: 'TEST-123' }
          ]
        }
      ]
    );

    res.json({
      success: true,
      message: 'WhatsApp service test completed',
      mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Demo',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'WhatsApp service test failed',
      error: error.message
    });
  }
});

/**
 * Test Email service
 */
router.get('/email', async (req, res) => {
  try {
    // Test email service
    const result = await EmailService.sendEmail(
      'test@example.com',
      'Test Email from Coconut Oil Ghana',
      `
        <h1>Test Email</h1>
        <p>This is a test email from the Coconut Oil Ghana e-commerce platform.</p>
        <p>If you received this, the email service is working correctly!</p>
        <p><strong>Mode:</strong> ${process.env.NODE_ENV === 'production' ? 'Production' : 'Demo'}</p>
      `
    );

    res.json({
      success: true,
      message: 'Email service test completed',
      mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Demo',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message
    });
  }
});

/**
 * Test order notification flow
 */
router.get('/notification-flow', async (req, res) => {
  try {
    const testOrder = {
      orderNumber: 'TEST-12345',
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+233241234567',
        whatsappNumber: '+233241234567'
      },
      shippingAddress: {
        street: '123 Test Street',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana',
        zipCode: '00233'
      },
      items: [
        {
          name: 'Pure Coconut Oil (500ml)',
          quantity: 2,
          price: 25.00
        },
        {
          name: 'Virgin Coconut Oil (1L)',
          quantity: 1,
          price: 45.00
        }
      ],
      subtotal: 95.00,
      deliveryFee: 15.00,
      total: 110.00,
      paymentMethod: 'mobile_money',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      paystackReference: 'TEST_REF_123',
      createdAt: new Date()
    };

    // Test all notification types
    const results = {
      whatsappOrderConfirmation: await WhatsAppService.sendOrderConfirmation(testOrder),
      emailOrderConfirmation: await EmailService.sendOrderConfirmation(testOrder),
      whatsappPaymentConfirmation: await WhatsAppService.sendPaymentConfirmation(testOrder),
      emailPaymentConfirmation: await EmailService.sendPaymentConfirmation(testOrder),
      whatsappAdminNotification: await WhatsAppService.sendAdminNotification(testOrder),
      emailAdminNotification: await EmailService.sendAdminOrderNotification(testOrder)
    };

    res.json({
      success: true,
      message: 'Notification flow test completed',
      mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Demo',
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Notification flow test failed',
      error: error.message
    });
  }
});

module.exports = router;
