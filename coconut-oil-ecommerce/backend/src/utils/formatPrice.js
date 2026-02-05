/**
 * Format price to Ghana Cedis
 * @param {Number} amount - Amount to format
 * @returns {String} Formatted price with currency symbol
 */
const formatToGHS = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parse price string to number
 * @param {String} priceString - Price string to parse
 * @returns {Number} Parsed price
 */
const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  
  // Remove currency symbols and commas
  const cleanString = priceString.replace(/[^\d.-]/g, '');
  return parseFloat(cleanString) || 0;
};

/**
 * Calculate delivery fee based on region
 * @param {String} region - Shipping region
 * @returns {Number} Delivery fee
 */
const calculateDeliveryFee = (region) => {
  const regionFees = {
    'Greater Accra': 10.00,
    'Ashanti': 20.00,
    'Western': 25.00,
    'Central': 20.00,
    'Eastern': 20.00,
    'Volta': 25.00,
    'Northern': 30.00,
    'Upper East': 35.00,
    'Upper West': 35.00,
    'Brong Ahafo': 25.00
  };

  return regionFees[region] || 25.00; // Default fee
};

/**
 * Calculate order total
 * @param {Array} items - Order items
 * @param {Number} deliveryFee - Delivery fee
 * @returns {Object} Calculated totals
 */
const calculateOrderTotal = (items, deliveryFee = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const total = subtotal + deliveryFee;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

module.exports = {
  formatToGHS,
  parsePrice,
  calculateDeliveryFee,
  calculateOrderTotal
};
