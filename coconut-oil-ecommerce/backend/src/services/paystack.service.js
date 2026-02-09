const axios = require('axios');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = 'https://api.paystack.co';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Axios available for Paystack integration');
  }

  /**
   * Initialize payment transaction
   */
  async initializePayment(paymentData) {
    try {
      // Add metadata if not present
      if (!paymentData.metadata) {
        paymentData.metadata = {
          custom_fields: []
        };
      }

      // Set currency to GHS (Ghana Cedis)
      paymentData.currency = 'GHS';

      // In development/demo mode, return mock data
      if (process.env.NODE_ENV !== 'production' || !this.secretKey) {
        console.log('💳 Paystack Payment Initialization (Demo Mode):');
        console.log('Email:', paymentData.email);
        console.log('Amount:', paymentData.amount / 100, 'GHS');
        console.log('Metadata:', paymentData.metadata);

        return {
          success: true,
          data: {
            authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/test`,
            access_code: 'demo_access_code',
            reference: 'DEMO_' + Date.now()
          }
        };
      }

      // In production, make actual API call
      const response = await this.axiosInstance.post('/transaction/initialize', paymentData);
      
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('Error initializing payment:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Verify payment transaction
   */
  async verifyPayment(reference) {
    try {
      // In development/demo mode, return mock verification
      if (process.env.NODE_ENV !== 'production' || !this.secretKey) {
        console.log('✅ Payment Verification (Demo Mode):');
        console.log('Reference:', reference);

        return {
          success: true,
          data: {
            reference: reference,
            status: 'success',
            amount: 250000, // 2500 GHS in kobo
            currency: 'GHS',
            channel: 'mobile_money',
            paid_at: new Date().toISOString(),
            customer: {
              email: 'test@example.com',
              first_name: 'Demo',
              last_name: 'Customer'
            }
          }
        };
      }

      // In production, make actual API call
      const response = await this.axiosInstance.get(`/transaction/verify/${reference}`);
      
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('Error verifying payment:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get supported payment channels
   */
  async getSupportedChannels() {
    try {
      // Return Ghana-specific payment channels
      const channels = {
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
      };

      return {
        success: true,
        data: channels
      };

    } catch (error) {
      console.error('Error getting payment channels:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create transfer recipient (for payouts)
   */
  async createTransferRecipient(recipientData) {
    try {
      // This would be used for payouts/refunds
      // For now, return demo data
      
      console.log('🏦 Transfer Recipient Creation (Demo Mode):');
      console.log('Recipient:', recipientData);

      return {
        success: true,
        data: {
          recipient_code: 'RCP_DEMO_' + Date.now(),
          details: recipientData
        }
      };

    } catch (error) {
      console.error('Error creating transfer recipient:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Initiate transfer (for payouts/refunds)
   */
  async initiateTransfer(transferData) {
    try {
      // This would be used for payouts/refunds
      // For now, return demo data
      
      console.log('💸 Transfer Initiation (Demo Mode):');
      console.log('Transfer:', transferData);

      return {
        success: true,
        data: {
          transfer_code: 'TRF_DEMO_' + Date.now(),
          status: 'pending',
          ...transferData
        }
      };

    } catch (error) {
      console.error('Error initiating transfer:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PaystackService();
