const PaystackService = require('../services/paystack.service');
const Order = require('../models/Order.model');

/**
 * Initialize payment with Paystack
 */
const initializePayment = async (req, res, next) => {
  try {
    const { orderId, email, amount, metadata } = req.body;

    if (!orderId || !email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, email, and amount are required'
      });
    }

    const paymentData = {
      email,
      amount: amount * 100, // Convert to kobo (Paystack expects amount in kobo)
      metadata: metadata || {},
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/verify`
    };

    const result = await PaystackService.initializePayment(paymentData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to initialize payment'
      });
    }

    // Update order with payment reference
    if (result.data.reference) {
      await Order.findByIdAndUpdate(orderId, {
        paystackReference: result.data.reference
      });
    }

    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: result.data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment with Paystack
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const result = await PaystackService.verifyPayment(reference);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Payment verification failed'
      });
    }

    // Update order payment status
    const paymentData = result.data;
    if (paymentData.status === 'success') {
      const order = await Order.findOne({ paystackReference: reference });
      if (order) {
        order.paymentStatus = 'paid';
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed';
        }
        await order.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment verification completed',
      data: paymentData
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Handle Paystack webhook events
 */
const handleWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature (in production)
    // For demo, we'll accept all webhooks
    
    const event = req.body;
    
    if (event.event === 'charge.success') {
      const { reference, customer } = event.data;
      
      // Update order status
      const order = await Order.findOne({ paystackReference: reference });
      if (order) {
        order.paymentStatus = 'paid';
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed';
        }
        await order.save();
        
        // Here you would trigger notifications
        console.log(`Order ${order.orderNumber} payment confirmed via webhook`);
      }
    }

    // Always return 200 to acknowledge receipt
    res.sendStatus(200);

  } catch (error) {
    next(error);
  }
};

/**
 * Get supported payment channels
 */
const getSupportedChannels = async (req, res, next) => {
  try {
    const channels = await PaystackService.getSupportedChannels();
    
    res.json({
      success: true,
      message: 'Payment channels retrieved',
      data: channels
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Test payment endpoint
 */
const testPayment = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Payment API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      currency: 'GHS (Ghana Cedis)',
      supported_channels: ['mobile_money', 'card', 'bank_transfer'],
      test_mode: process.env.NODE_ENV !== 'production'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getSupportedChannels,
  testPayment
};
