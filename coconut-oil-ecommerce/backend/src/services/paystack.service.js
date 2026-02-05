/**
 * Paystack Service
 * Handles all Paystack API interactions
 */

const axios = require('axios');
const paystackConfig = require('../config/paystack');

class PaystackService {
  constructor() {
    this.secretKey = paystackConfig.secretKey;
    this.publicKey = paystackConfig.publicKey;
    this.baseUrl = paystackConfig.baseUrl;
    this.currency = paystackConfig.currency;
    
    // Create axios instance with Paystack headers
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Initialize a payment transaction
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} - Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      const {
        email,
        amount,
        reference,
        metadata = {},
        callback_url,
        channels = paystackConfig.channels
      } = paymentData;

      // Convert amount to kobo (smallest currency unit for Paystack)
      const amountInKobo = Math.round(amount * 100);

      const payload = {
        email,
        amount: amountInKobo,
        reference,
        currency: this.currency,
        channels,
        callback_url,
        metadata
      };

      console.log('Initializing Paystack payment:', {
        email,
        amount: `${amount} GHS (${amountInKobo} kobo)`,
        reference,
        channels
      });

      const response = await this.api.post('/transaction/initialize', payload);
      
      if (response.data.status && response.data.data) {
        return {
          success: true,
          authorization_url: response.data.data.authorization_url,
          access_code: response.data.data.access_code,
          reference: response.data.data.reference
        };
      } else {
        throw new Error('Failed to initialize payment');
      }

    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        code: error.response?.data?.status || 'PAYMENT_INIT_ERROR'
      };
    }
  }

  /**
   * Verify a payment transaction
   * @param {string} reference - Paystack transaction reference
   * @returns {Promise<Object>} - Payment verification result
   */
  async verifyPayment(reference) {
    try {
      console.log('Verifying Paystack payment:', reference);

      const response = await this.api.get(`/transaction/verify/${reference}`);

      if (response.data.status && response.data.data) {
        const transaction = response.data.data;
        
        // Determine payment status
        let paymentStatus = 'pending';
        if (transaction.status === 'success') {
          paymentStatus = 'paid';
        } else if (transaction.status === 'failed') {
          paymentStatus = 'failed';
        } else if (transaction.status === 'abandoned') {
          paymentStatus = 'failed';
        }

        return {
          success: true,
          verified: transaction.status === 'success',
          data: {
            reference: transaction.reference,
            amount: transaction.amount / 100, // Convert from kobo to GHS
            currency: transaction.currency,
            status: paymentStatus,
            paidAt: transaction.paid_at,
            gateway_response: transaction.gateway_response,
            channel: transaction.channel,
            authorization: transaction.authorization,
            customer: transaction.customer,
            metadata: transaction.metadata
          }
        };
      } else {
        return {
          success: false,
          verified: false,
          error: 'Transaction not found'
        };
      }

    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      return {
        success: false,
        verified: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create a transfer recipient (for bank transfers)
   * @param {Object} recipientData - Recipient details
   * @returns {Promise<Object>} - Recipient creation result
   */
  async createTransferRecipient(recipientData) {
    try {
      const { type, name, account_number, bank_code, currency = 'GHS' } = recipientData;

      const payload = {
        type,
        name,
        account_number,
        bank_code,
        currency
      };

      const response = await this.api.post('/transferrecipient', payload);
      
      if (response.data.status && response.data.data) {
        return {
          success: true,
          recipient_code: response.data.data.recipient_code,
          details: response.data.data
        };
      } else {
        throw new Error('Failed to create transfer recipient');
      }

    } catch (error) {
      console.error('Create recipient error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Initialize a transfer to recipient
   * @param {Object} transferData - Transfer details
   * @returns {Promise<Object>} - Transfer initialization result
   */
  async initializeTransfer(transferData) {
    try {
      const { source, amount, recipient, reason } = transferData;

      // Convert amount to kobo
      const amountInKobo = Math.round(amount * 100);

      const payload = {
        source,
        amount: amountInKobo,
        recipient,
        reason,
        currency: this.currency
      };

      const response = await this.api.post('/transfer', payload);
      
      if (response.data.status && response.data.data) {
        return {
          success: true,
          transfer_code: response.data.data.transfer_code,
          reference: response.data.data.reference,
          details: response.data.data
        };
      } else {
        throw new Error('Failed to initialize transfer');
      }

    } catch (error) {
      console.error('Initialize transfer error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * List supported banks (Ghana)
   * @returns {Promise<Array>} - List of banks
   */
  async listBanks() {
    try {
      const response = await this.api.get('/bank', {
        params: {
          country: 'ghana',
          currency: 'GHS'
        }
      });

      if (response.data.status && response.data.data) {
        return {
          success: true,
          banks: response.data.data
        };
      } else {
        throw new Error('Failed to fetch banks');
      }

    } catch (error) {
      console.error('List banks error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Generate a unique payment reference
   * @returns {string} - Unique reference
   */
  generatePaymentReference() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PAYSTACK_${timestamp}_${random}`;
  }

  /**
   * Validate Ghana mobile money number
   * @param {string} phone - Phone number
   * @param {string} provider - Mobile money provider
   * @returns {Object} - Validation result
   */
  validateMobileMoneyNumber(phone, provider) {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a Ghana number
    if (!cleanPhone.startsWith('233') && cleanPhone.length === 9) {
      // Add Ghana country code
      const formattedPhone = `233${cleanPhone}`;
      
      // Validate based on provider
      let isValid = false;
      switch (provider) {
        case 'MTN':
          isValid = formattedPhone.startsWith('23324') || formattedPhone.startsWith('23354') || 
                    formattedPhone.startsWith('23355') || formattedPhone.startsWith('23359');
          break;
        case 'VODAFONE':
          isValid = formattedPhone.startsWith('23320') || formattedPhone.startsWith('23350');
          break;
        case 'AIRTELTIGO':
          isValid = formattedPhone.startsWith('23327') || formattedPhone.startsWith('23357');
          break;
        default:
          isValid = true;
      }
      
      return {
        isValid,
        formatted: formattedPhone,
        provider: isValid ? provider : 'UNKNOWN'
      };
    }
    
    return {
      isValid: false,
      formatted: cleanPhone,
      provider: 'INVALID'
    };
  }

  /**
   * Handle Paystack webhook events
   * @param {Object} webhookData - Webhook payload
   * @param {string} signature - Webhook signature for verification
   * @returns {Object} - Webhook processing result
   */
  async handleWebhook(webhookData, signature) {
    try {
      // Verify webhook signature (in production)
      if (paystackConfig.webhookSecret && signature) {
        const crypto = require('crypto');
        const hash = crypto.createHmac('sha512', paystackConfig.webhookSecret)
          .update(JSON.stringify(webhookData))
          .digest('hex');
        
        if (hash !== signature) {
          return {
            success: false,
            error: 'Invalid webhook signature'
          };
        }
      }

      const { event, data } = webhookData;

      console.log('Processing Paystack webhook:', event);

      // Handle different webhook events
      switch (event) {
        case 'charge.success':
          return {
            success: true,
            event: 'payment_success',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              status: 'paid',
              paidAt: data.paid_at,
              metadata: data.metadata
            }
          };

        case 'charge.failed':
          return {
            success: true,
            event: 'payment_failed',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              status: 'failed',
              failureReason: data.gateway_response,
              metadata: data.metadata
            }
          };

        case 'transfer.success':
          return {
            success: true,
            event: 'transfer_success',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              status: 'transferred',
              transferredAt: data.transferred_at,
              recipient: data.recipient
            }
          };

        case 'transfer.failed':
          return {
            success: true,
            event: 'transfer_failed',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              status: 'transfer_failed',
              failureReason: data.reason,
              recipient: data.recipient
            }
          };

        default:
          console.log('Unhandled webhook event:', event);
          return {
            success: true,
            event: 'unhandled',
            data
          };
      }

    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PaystackService();
