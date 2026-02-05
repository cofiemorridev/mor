const { Paystack } = require('@paystack/paystack-sdk');

// Initialize Paystack with secret key
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  currency: 'GHS', // Ghana Cedis
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  mobileMoney: {
    networks: ['MTN', 'VODAFONE', 'AIRTEL_TIGO']
  }
};

// Test connection
const testConnection = async () => {
  try {
    // Simple test - list transactions
    const response = await paystack.transaction.list({ perPage: 1 });
    console.log('✅ Paystack connection successful');
    return true;
  } catch (error) {
    console.error('❌ Paystack connection failed:', error.message);
    return false;
  }
};

module.exports = {
  paystack,
  paystackConfig,
  testConnection
};
