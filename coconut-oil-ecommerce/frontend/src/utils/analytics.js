// Development Analytics - No real tracking during development

const IS_PRODUCTION = import.meta.env.PROD;
const IS_DEVELOPMENT = !IS_PRODUCTION;

// Mock GA Measurement ID (replace with real one in production)
export const GA_MEASUREMENT_ID = IS_PRODUCTION 
  ? 'G-XXXXXXXXXX'  // ⚠️ Will be set in production
  : 'G-DEVELOPMENT'; // Mock ID for development

// Console logger for development
export const devLogger = {
  log: (event, data) => {
    if (IS_DEVELOPMENT) {
      console.log(`📊 [Analytics Dev] ${event}:`, data);
    }
  },
  warn: (message) => {
    if (IS_DEVELOPMENT) {
      console.warn(`⚠️ [Analytics Dev] ${message}`);
    }
  },
  error: (error) => {
    if (IS_DEVELOPMENT) {
      console.error(`❌ [Analytics Dev Error]`, error);
    }
  }
};

// Check if GA is available
export const isGAAvailable = () => {
  if (IS_DEVELOPMENT) {
    return false; // Don't load GA in development
  }
  return typeof window !== 'undefined' && window.gtag;
};

// Initialize GA (only in production)
export const initGA = () => {
  if (IS_PRODUCTION && isGAAvailable()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
    console.log('✅ Google Analytics initialized for production');
  } else if (IS_DEVELOPMENT) {
    devLogger.log('GA Initialized', 'Mocked for development');
  }
};

// Track page views
export const trackPageView = (path) => {
  if (isGAAvailable()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
  devLogger.log('Page View', { path });
};

// Track events
export const trackEvent = ({ action, category, label, value }) => {
  if (isGAAvailable()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  devLogger.log('Event', { action, category, label, value });
};

// Track product views
export const trackProductView = (productId, productName, category, price) => {
  trackEvent({
    action: 'view_item',
    category: 'products',
    label: `${productName} (${productId})`,
    value: price,
  });
  devLogger.log('Product View', { productId, productName, category, price });
};

// Track add to cart
export const trackAddToCart = (productId, productName, quantity, price) => {
  trackEvent({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: `${productName} (${productId})`,
    value: price * quantity,
  });
  devLogger.log('Add to Cart', { productId, productName, quantity, price });
};

// Track checkout steps
export const trackCheckoutStep = (step, option = '') => {
  trackEvent({
    action: 'checkout_progress',
    category: 'checkout',
    label: `Step ${step}${option ? `: ${option}` : ''}`,
  });
  devLogger.log('Checkout Step', { step, option });
};

// Track purchase
export const trackPurchase = (transactionId, value, items = []) => {
  trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    label: transactionId,
    value: value,
  });
  devLogger.log('Purchase', { transactionId, value, items });
};

// Track search
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  });
  devLogger.log('Search', { searchTerm, resultsCount });
};

// Mock analytics data for development dashboard
export const getMockAnalyticsData = () => {
  return {
    pageViews: Math.floor(Math.random() * 1000) + 500,
    users: Math.floor(Math.random() * 700) + 300,
    sessions: Math.floor(Math.random() * 1200) + 800,
    bounceRate: `${Math.floor(Math.random() * 40) + 20}%`,
    avgSessionDuration: `${Math.floor(Math.random() * 4) + 2}m ${Math.floor(Math.random() * 60)}s`,
    conversionRate: `${(Math.random() * 5).toFixed(1)}%`,
    revenue: `₵${Math.floor(Math.random() * 5000) + 3000}`,
  };
};
