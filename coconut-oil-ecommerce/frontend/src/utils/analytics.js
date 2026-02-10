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

// Track page view
export const trackPageView = (url) => {
  if (IS_PRODUCTION && isGAAvailable()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } else if (IS_DEVELOPMENT) {
    devLogger.log('Page View', { url });
  }
};

// Track event
export const trackEvent = ({ action, category, label, value }) => {
  if (IS_PRODUCTION && isGAAvailable()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else if (IS_DEVELOPMENT) {
    devLogger.log('Event Tracked', { action, category, label, value });
  }
};

// E-commerce specific events
export const trackProductView = (product) => {
  trackEvent({
    action: 'view_item',
    category: 'ecommerce',
    label: product.name || product.id,
    value: product.price || 0
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: product.name || product.id,
    value: quantity
  });
};

export const trackCheckoutStep = (step, value = 0) => {
  trackEvent({
    action: 'checkout_progress',
    category: 'ecommerce',
    label: step,
    value: value
  });
};

export const trackPurchase = (order) => {
  trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    label: `Order ${order.orderNumber || order.id}`,
    value: order.total || 0
  });
};

// User engagement events
export const trackSearch = (searchTerm) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm
  });
};

export const trackSignUp = (method = 'email') => {
  trackEvent({
    action: 'sign_up',
    category: 'engagement',
    label: method
  });
};

// Development helpers
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
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    pageViews: Math.floor(Math.random() * 1000) + 500,
    sessions: Math.floor(Math.random() * 300) + 150,
    users: Math.floor(Math.random() * 200) + 100,
    conversionRate: (Math.random() * 5).toFixed(2) + '%',
    topProducts: [
      { name: 'Organic Virgin Coconut Oil', views: 342, conversions: 28 },
      { name: 'Cold Pressed Coconut Oil', views: 289, conversions: 19 },
      { name: 'Coconut Oil Hair Treatment', views: 234, conversions: 15 },
      { name: 'Coconut Cooking Oil', views: 198, conversions: 12 },
      { name: 'Coconut Oil Massage', views: 156, conversions: 8 },
    ],
    trafficSources: {
      direct: 35,
      organic: 40,
      referral: 15,
      social: 10,
    },
    dailyData: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: Math.floor(Math.random() * 200) + 100,
        sales: Math.floor(Math.random() * 30) + 10,
      };
    }).reverse(),
  };
};
