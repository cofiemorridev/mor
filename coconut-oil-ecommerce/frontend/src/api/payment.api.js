import api from './axios';

/**
 * Payment API functions for Paystack integration
 */

/**
 * Initialize a Paystack payment
 * @param {Object} paymentData - Payment initialization data
 */
export const initializePayment = async (paymentData) => {
  try {
    const response = await api.post('/api/payment/initialize', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid payment data');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Verify a Paystack payment
 * @param {string} reference - Payment reference
 */
export const verifyPayment = async (reference) => {
  try {
    const response = await api.get(`/api/payment/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Get supported payment channels
 */
export const getPaymentChannels = async () => {
  try {
    const response = await api.get('/api/payment/channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment channels:', error);
    throw error;
  }
};

/**
 * Validate mobile money number
 * @param {Object} validationData - Phone and provider
 */
export const validateMobileMoney = async (validationData) => {
  try {
    const response = await api.post('/api/payment/validate-mobile-money', validationData);
    return response.data;
  } catch (error) {
    console.error('Error validating mobile money:', error);
    throw error;
  }
};

/**
 * Get list of supported banks (Ghana)
 */
export const getBanks = async () => {
  try {
    const response = await api.get('/api/payment/banks');
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};

/**
 * Test payment endpoint
 */
export const testPayment = async () => {
  try {
    const response = await api.get('/api/payment/test');
    return response.data;
  } catch (error) {
    console.error('Error testing payment:', error);
    throw error;
  }
};

/**
 * Generate a payment reference
 * @returns {string} - Unique payment reference
 */
export const generatePaymentReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PAY_${timestamp}_${random}`;
};

/**
 * Format amount for Paystack (GHS to kobo)
 * @param {number} amount - Amount in GHS
 * @returns {number} - Amount in kobo
 */
export const formatAmountForPaystack = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Parse amount from Paystack (kobo to GHS)
 * @param {number} amount - Amount in kobo
 * @returns {number} - Amount in GHS
 */
export const parseAmountFromPaystack = (amount) => {
  return amount / 100;
};
