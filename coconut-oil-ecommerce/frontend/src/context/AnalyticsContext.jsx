import React, { createContext, useContext, useState, useCallback } from 'react';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [analyticsEvents, setAnalyticsEvents] = useState([]);

  const trackEvent = useCallback((eventName, eventData = {}) => {
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    
    setAnalyticsEvents(prev => [...prev, event]);
    
    // Log to console for development
    console.log(`[Analytics] ${eventName}:`, eventData);
    
    // Here you would normally send to Google Analytics, etc.
    // For now, we just log to console
    
    return event;
  }, []);

  const value = {
    trackEvent,
    analyticsEvents,
    // Add backward-compatible methods
    trackProductView: (id, name, category, price) => 
      trackEvent('product_view', { id, name, category, price }),
    trackAddToCart: (id, name, quantity, price) => 
      trackEvent('add_to_cart', { id, name, quantity, price }),
    trackCheckoutStep: (step, option) => 
      trackEvent('checkout_step', { step, option }),
    trackPurchase: (transactionId, total, items) => 
      trackEvent('purchase', { transactionId, total, items }),
    trackSearch: (searchTerm, resultsCount) => 
      trackEvent('search', { searchTerm, resultsCount }),
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook for using analytics context
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
