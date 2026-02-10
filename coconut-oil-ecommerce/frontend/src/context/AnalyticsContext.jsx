import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initGA, 
  trackPageView, 
  trackEvent, 
  trackProductView, 
  trackAddToCart, 
  trackCheckoutStep, 
  trackPurchase,
  trackSearch,
  getMockAnalyticsData,
  devLogger
} from '../utils/analytics';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [mockData, setMockData] = useState(getMockAnalyticsData());

  useEffect(() => {
    // Initialize analytics
    initGA();
    
    // Track initial page view
    trackPageView(window.location.pathname);
    
    // Listen for route changes
    const handleRouteChange = () => {
      trackPageView(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Update mock data every 30 seconds (simulates live updates)
    const interval = setInterval(() => {
      setMockData(getMockAnalyticsData());
    }, 30000);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, []);

  // Track events and store them for dev dashboard
  const handleTrackEvent = (event, data) => {
    const eventData = {
      timestamp: new Date().toISOString(),
      event,
      data,
    };
    
    setAnalyticsEvents(prev => [eventData, ...prev.slice(0, 49)]);
    
    // Map to specific tracking functions
    switch (event) {
      case 'page_view':
        trackPageView(data.path);
        break;
      case 'product_view':
        trackProductView(data.productId, data.productName, data.category, data.price);
        break;
      case 'add_to_cart':
        trackAddToCart(data.productId, data.productName, data.quantity, data.price);
        break;
      case 'checkout_step':
        trackCheckoutStep(data.step, data.option);
        break;
      case 'purchase':
        trackPurchase(data.transactionId, data.value, data.items);
        break;
      case 'search':
        trackSearch(data.searchTerm, data.resultsCount);
        break;
      default:
        trackEvent(data);
    }
  };

  const value = {
    // Tracking functions
    trackPageView: (path) => handleTrackEvent('page_view', { path }),
    trackProductView: (productId, productName, category, price) => 
      handleTrackEvent('product_view', { productId, productName, category, price }),
    trackAddToCart: (productId, productName, quantity, price) => 
      handleTrackEvent('add_to_cart', { productId, productName, quantity, price }),
    trackCheckoutStep: (step, option) => 
      handleTrackEvent('checkout_step', { step, option }),
    trackPurchase: (transactionId, value, items) => 
      handleTrackEvent('purchase', { transactionId, value, items }),
    trackSearch: (searchTerm, resultsCount) => 
      handleTrackEvent('search', { searchTerm, resultsCount }),
    trackEvent: (data) => handleTrackEvent('custom_event', data),
    
    // Analytics data
    analyticsEvents,
    mockData,
    
    // Development logger
    devLogger,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContext;
