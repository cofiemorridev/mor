/**
 * Paystack Configuration
 * For Ghana: GHS currency, Mobile Money, Cards, Bank Transfer
 */

const { get } = require('./env');

const paystackConfig = {
  // API Keys - from environment variables
  secretKey: get('PAYSTACK_SECRET_KEY', ''),
  publicKey: get('PAYSTACK_PUBLIC_KEY', ''),
  
  // Ghana-specific settings
  currency: 'GHS', // Ghana Cedis
  channels: ['card', 'bank', 'mobile_money'],
  
  // URLs
  baseUrl: get('PAYSTACK_BASE_URL', 'https://api.paystack.co'),
  
  // Webhook secret (for verifying webhook signatures)
  webhookSecret: get('PAYSTACK_WEBHOOK_SECRET', ''),
  
  // Test mode settings
  testMode: get('NODE_ENV', 'development') !== 'production',
  
  // Ghana mobile money providers
  mobileMoneyProviders: {
    'MTN': 'mtn',
    'VODAFONE': 'vodafone', 
    'AIRTELTIGO': 'tigo',
    'ALL': 'mobile_money'
  },
  
  // Ghana bank codes (sample - you can expand this)
  bankCodes: {
    '044': 'Access Bank',
    '023': 'Citi Bank',
    '063': 'Diamond Bank',
    '050': 'Ecobank',
    '070': 'Fidelity Bank',
    '011': 'First Bank',
    '058': 'GTBank',
    '030': 'Heritage Bank',
    '301': 'Jaiz Bank',
    '082': 'Keystone Bank',
    '014': 'MainStreet Bank',
    '076': 'Skye Bank',
    '084': 'Stanbic IBTC',
    '221': 'Stanbic IBTC',
    '068': 'Standard Chartered',
    '232': 'Sterling Bank',
    '100': 'Suntrust Bank',
    '032': 'Union Bank',
    '033': 'United Bank',
    '215': 'Unity Bank',
    '035': 'Wema Bank',
    '057': 'Zenith Bank'
  }
};

// Helper to get test credentials if in development
if (paystackConfig.testMode && !paystackConfig.secretKey) {
  console.log('⚠️  Running in test mode with demo Paystack keys');
  // These are test keys - replace with real keys in production
  paystackConfig.secretKey = 'sk_test_cb1a7b7e42c6c6a81b6b5c7d8f9a0b1c2d3e4f5g6';
  paystackConfig.publicKey = 'pk_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s';
}

module.exports = paystackConfig;
