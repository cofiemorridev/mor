import { useAnalytics as useAnalyticsContext } from '../context/AnalyticsContext';

// Main hook that components should import
export const useAnalytics = () => {
  const { 
    trackEvent,
    analyticsEvents
  } = useAnalyticsContext();

  // Helper functions for common events
  const trackProductView = (productId, name, category, price) => {
    trackEvent('product_view', { productId, name, category, price });
  };

  const trackAddToCart = (productId, name, quantity, price) => {
    trackEvent('add_to_cart', { productId, name, quantity, price });
  };

  const trackCheckoutStep = (step, option = '') => {
    trackEvent('checkout_step', { step, option });
  };

  const trackPurchase = (transactionId, total, items = []) => {
    trackEvent('purchase', { transactionId, total, items });
  };

  const trackSearch = (searchTerm, resultsCount = 0) => {
    trackEvent('search', { searchTerm, resultsCount });
  };

  return {
    trackEvent,
    trackProductView,
    trackAddToCart,
    trackCheckoutStep,
    trackPurchase,
    trackSearch,
    analyticsEvents,
  };
};

// Specific hooks for different contexts
export const useProductAnalytics = (product) => {
  const analytics = useAnalytics();

  const handleProductView = () => {
    if (product) {
      analytics.trackProductView(
        product.id, 
        product.name, 
        product.category, 
        product.price
      );
    }
  };

  const handleAddToCart = (quantity = 1) => {
    if (product) {
      analytics.trackAddToCart(
        product.id, 
        product.name, 
        quantity, 
        product.price
      );
    }
  };

  return {
    handleProductView,
    handleAddToCart,
  };
};

export const useCheckoutAnalytics = () => {
  const analytics = useAnalytics();

  const handleCheckoutStep = (step, option = '') => {
    analytics.trackCheckoutStep(step, option);
  };

  const handlePurchase = (transactionId, total, items = []) => {
    analytics.trackPurchase(transactionId, total, items);
  };

  return {
    handleCheckoutStep,
    handlePurchase,
  };
};

export const useSearchAnalytics = () => {
  const analytics = useAnalytics();

  const handleSearch = (searchTerm, resultsCount = 0) => {
    analytics.trackSearch(searchTerm, resultsCount);
  };

  return {
    handleSearch,
  };
};

// Default export for backward compatibility
export default useAnalytics;
