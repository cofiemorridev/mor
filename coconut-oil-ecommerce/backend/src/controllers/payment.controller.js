/**
 * Payment Controller
 * Handles payment initialization, verification, and webhooks
 */

const PaystackService = require('../services/paystack.service');
const Order = require('../models/Order.model');

/**
 * @desc    Initialize Paystack payment
 * @route   POST /api/payment/initialize
 * @access  Public
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

    // Generate or use provided reference
    let reference;
    if (metadata.orderNumber) {
      reference = `ORD_${metadata.orderNumber}`;
    } else {
      reference = PaystackService.generatePaymentReference();
    }

    // Prepare payment data for Paystack
    const paymentData = {
      email: customerEmail,
      amount: parseFloat(amount),
      reference,
      metadata: {
        ...metadata,
        orderId,
        orderNumber,
        timestamp: new Date().toISOString()
      },
      callback_url: callbackUrl || `${process.env.FRONTEND_URL}/payment/verify`
    };

    // Initialize payment with Paystack
    const paymentResult = await PaystackService.initializePayment(paymentData);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error || 'Failed to initialize payment'
      });
    }

    // If orderId is provided, update order with payment reference
    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          paystackReference: reference,
          paymentStatus: 'pending'
        });
      } catch (dbError) {
        console.error('Error updating order with payment reference:', dbError);
        // Don't fail the payment initialization if order update fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
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
      message: 'Server error while initializing payment'
    });
  }
};

/**
 * @desc    Verify Paystack payment
 * @route   GET /api/payment/verify/:reference
 * @access  Public
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

    // Verify payment with Paystack
    const verificationResult = await PaystackService.verifyPayment(reference);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.error || 'Payment verification failed'
      });
    }

    const paymentData = verificationResult.data;

    // Try to find and update order with this reference
    let orderUpdateResult = null;
    try {
      const order = await Order.findOne({ paystackReference: reference });
      
      if (order) {
        // Update order payment status
        order.paymentStatus = paymentData.status;
        
        // If payment is successful, update order status to confirmed
        if (paymentData.status === 'paid' && order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed';
        }
        
        await order.save();
        
        orderUpdateResult = {
          orderId: order._id,
          orderNumber: order.orderNumber,
          updated: true
        };
      }
    } catch (dbError) {
      console.error('Error updating order after payment verification:', dbError);
      orderUpdateResult = {
        error: 'Failed to update order',
        details: dbError.message
      };
    }

    res.status(200).json({
      success: true,
      verified: verificationResult.verified,
      message: verificationResult.verified ? 
        'Payment verified successfully' : 
        'Payment verification failed',
      data: {
        payment: paymentData,
        order: orderUpdateResult
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    });
  }
};

/**
 * @desc    Handle Paystack webhook events
 * @route   POST /api/payment/webhook
 * @access  Public (called by Paystack)
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const webhookData = req.body;

    console.log('Received Paystack webhook:', webhookData.event);

    // Process webhook
    const webhookResult = await PaystackService.handleWebhook(webhookData, signature);

    if (!webhookResult.success) {
      return res.status(400).json({
        success: false,
        message: webhookResult.error
      });
    }

    // Handle specific webhook events
    if (webhookResult.event === 'payment_success') {
      const { reference, metadata } = webhookResult.data;
      
      // Update order if we have an order reference
      if (metadata && metadata.orderId) {
        try {
          await Order.findByIdAndUpdate(metadata.orderId, {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            paystackReference: reference,
            updatedAt: new Date()
          });
          
          console.log(`Order ${metadata.orderId} updated via webhook for payment ${reference}`);
          
          // Here you would typically:
          // 1. Send order confirmation email
          // 2. Send WhatsApp notification
          // 3. Update inventory
          // 4. Any other post-payment processing
          
        } catch (dbError) {
          console.error('Error updating order from webhook:', dbError);
        }
      }
    } else if (webhookResult.event === 'payment_failed') {
      const { reference, metadata } = webhookResult.data;
      
      if (metadata && metadata.orderId) {
        try {
          await Order.findByIdAndUpdate(metadata.orderId, {
            paymentStatus: 'failed',
            paystackReference: reference,
            updatedAt: new Date()
          });
          
          console.log(`Order ${metadata.orderId} marked as failed for payment ${reference}`);
          
        } catch (dbError) {
          console.error('Error updating failed order from webhook:', dbError);
        }
      }
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook handling error:', error);
    
    // Still return 200 to prevent Paystack from retrying indefinitely
    res.status(200).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
};

/**
 * @desc    Get supported payment channels
 * @route   GET /api/payment/channels
 * @access  Public
 */
const getPaymentChannels = async (req, res) => {
  try {
    const channels = [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Pay with MTN, Vodafone, or AirtelTigo Mobile Money',
        providers: [
          { id: 'mtn', name: 'MTN Mobile Money', icon: '📱' },
          { id: 'vodafone', name: 'Vodafone Cash', icon: '💼' },
          { id: 'tigo', name: 'AirtelTigo Money', icon: '📞' }
        ],
        supportedCountries: ['Ghana'],
        currency: 'GHS'
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, or Verve cards',
        providers: [
          { id: 'visa', name: 'Visa', icon: '💳' },
          { id: 'mastercard', name: 'Mastercard', icon: '💳' },
          { id: 'verve', name: 'Verve', icon: '💳' }
        ],
        supportedCountries: ['Ghana', 'International'],
        currency: 'GHS'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Transfer directly from your bank account',
        providers: [
          { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
        ],
        supportedCountries: ['Ghana'],
        currency: 'GHS'
      }
    ];

    res.status(200).json({
      success: true,
      data: channels
    });

  } catch (error) {
    console.error('Get payment channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment channels'
    });
  }
};

/**
 * @desc    Validate mobile money number
 * @route   POST /api/payment/validate-mobile-money
 * @access  Public
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
      message: 'Server error while validating mobile money number'
    });
  }
};

/**
 * @desc    Get list of supported banks (for Ghana)
 * @route   GET /api/payment/banks
 * @access  Public
 */
const getBanks = async (req, res) => {
  try {
    const banksResult = await PaystackService.listBanks();

    if (!banksResult.success) {
      return res.status(400).json({
        success: false,
        message: banksResult.error || 'Failed to fetch banks'
      });
    }

    res.status(200).json({
      success: true,
      data: banksResult.banks
    });

  } catch (error) {
    console.error('Get banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching banks'
    });
  }
};

/**
 * @desc    Test payment endpoint (for development)
 * @route   GET /api/payment/test
 * @access  Public
 */
const testPayment = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payment API is working',
      data: {
        test_mode: PaystackService.testMode,
        currency: PaystackService.currency,
        supported_channels: PaystackService.channels,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in test endpoint'
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentChannels,
  validateMobileMoneyNumber,
  getBanks,
  testPayment
};
