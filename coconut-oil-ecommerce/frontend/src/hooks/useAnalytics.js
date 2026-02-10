import { useAnalytics } from '../context/AnalyticsContext';

export const useProductAnalytics = (product) => {
  const { 
    trackProductView, 
    trackAddToCart 
  } = useAnalytics();

  const handleProductView = () => {
    if (product) {
      trackProductView(
        product.id, 
        product.name, 
        product.category, 
        product.price
      );
    }
  };

  const handleAddToCart = (quantity = 1) => {
    if (product) {
      trackAddToCart(
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
  const { 
    trackCheckoutStep, 
    trackPurchase 
  } = useAnalytics();

  const handleCheckoutStep = (step, option = '') => {
    trackCheckoutStep(step, option);
  };

  const handlePurchase = (transactionId, total, items = []) => {
    trackPurchase(transactionId, total, items);
  };

  return {
    handleCheckoutStep,
    handlePurchase,
  };
};

export const useSearchAnalytics = () => {
  const { trackSearch } = useAnalytics();

  const handleSearch = (searchTerm, resultsCount = 0) => {
    trackSearch(searchTerm, resultsCount);
  };

  return {
    handleSearch,
  };
};

export default useAnalytics;
