/**
 * Payment Controller - Updated with better demo mode handling
 */

const PaystackService = require('../services/paystack.service');

/**
 * Initialize payment - with robust error handling
 */
const initializePayment = async (req, res) => {
  try {
    const { 
      orderId, 
      orderNumber, 
      customerEmail, 
      amount, 
      metadata = {},
      callbackUrl 
    } = req.body;

    // Validate required fields
    if (!customerEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Customer email and amount are required'
      });
    }

    // Generate reference
    const reference = metadata.orderNumber ? 
      `ORD_${metadata.orderNumber}` : 
      PaystackService.generatePaymentReference();

    // Prepare payment data
    const paymentData = {
      email: customerEmail,
      amount: parseFloat(amount),
      reference,
      metadata: {
        ...metadata,
        orderId,
        orderNumber,
        timestamp: new Date().toISOString(),
        demo: PaystackService.testMode || !PaystackService.hasAxios
      },
      callback_url: callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`
    };

    // Initialize payment
    const paymentResult = await PaystackService.initializePayment(paymentData);

    if (!paymentResult.success && !paymentResult.fallback) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error || 'Failed to initialize payment',
        demo: false
      });
    }

    res.status(200).json({
      success: true,
      message: paymentResult.demo ? 
        'Demo payment initialized (axios not available)' : 
        'Payment initialized successfully',
      demo: paymentResult.demo || false,
      fallback: paymentResult.fallback || false,
      data: {
        authorization_url: paymentResult.authorization_url,
        reference: paymentResult.reference,
        access_code: paymentResult.access_code,
        public_key: process.env.PAYSTACK_PUBLIC_KEY || PaystackService.publicKey
      }
    });

  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while initializing payment',
      demo: true,
      error: error.message
    });
  }
};

/**
 * Verify payment - with demo mode support
 */
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const verificationResult = await PaystackService.verifyPayment(reference);

    if (!verificationResult.success && !verificationResult.fallback) {
      return res.status(400).json({
        success: false,
        message: verificationResult.error || 'Payment verification failed',
        demo: false
      });
    }

    res.status(200).json({
      success: true,
      verified: verificationResult.verified,
      demo: verificationResult.demo || false,
      fallback: verificationResult.fallback || false,
      message: verificationResult.verified ? 
        (verificationResult.demo ? 'Demo payment verified' : 'Payment verified successfully') : 
        'Payment verification failed',
      data: {
        payment: verificationResult.data,
        demo: verificationResult.demo || false
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment',
      demo: true,
      error: error.message
    });
  }
};

/**
 * Handle webhooks - always succeed in demo mode
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const webhookData = req.body;

    console.log('Received Paystack webhook:', webhookData.event || 'demo');

    const webhookResult = await PaystackService.handleWebhook(webhookData, signature);

    // Always return 200 for webhooks to prevent retries
    res.status(200).json({
      success: true,
      message: 'Webhook processed',
      demo: webhookResult.demo || false,
      data: webhookResult
    });

  } catch (error) {
    console.error('Webhook handling error:', error);
    
    // Still return 200 to prevent Paystack from retrying
    res.status(200).json({
      success: true,
      message: 'Webhook received (error handled)',
      demo: true,
      error: error.message
    });
  }
};

/**
 * Get payment channels
 */
const getPaymentChannels = async (req, res) => {
  try {
    const channelsResult = PaystackService.getSupportedChannels();

    res.status(200).json({
      success: true,
      demo: PaystackService.testMode || !PaystackService.hasAxios,
      data: channelsResult.channels
    });

  } catch (error) {
    console.error('Get payment channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment channels',
      demo: true
    });
  }
};

/**
 * Validate mobile money number
 */
const validateMobileMoneyNumber = async (req, res) => {
  try {
    const { phone, provider } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const validationResult = PaystackService.validateMobileMoneyNumber(phone, provider);

    res.status(200).json({
      success: true,
      data: validationResult,
      message: validationResult.isValid ? 
        'Valid mobile money number' : 
        'Invalid mobile money number'
    });

  } catch (error) {
    console.error('Validate mobile money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating mobile money number',
      demo: true
    });
  }
};

/**
 * Test payment endpoint
 */
const testPayment = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payment API is working',
      demo: PaystackService.testMode || !PaystackService.hasAxios,
      hasAxios: PaystackService.hasAxios,
      data: {
        test_mode: PaystackService.testMode,
        has_axios: PaystackService.hasAxios,
        currency: PaystackService.currency,
        supported_channels: PaystackService.channels,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in test endpoint',
      demo: true,
      error: error.message
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentChannels,
  validateMobileMoneyNumber,
  testPayment
};
