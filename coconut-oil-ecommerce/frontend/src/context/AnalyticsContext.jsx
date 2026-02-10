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

  const logEvent = (event) => {
    if (import.meta.env.DEV) {
      setAnalyticsEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    }
  };

  const analytics = {
    // Page tracking
    trackPageView: (url) => {
      trackPageView(url);
      logEvent({ type: 'page_view', url, timestamp: new Date() });
    },
    
    // Generic event tracking
    trackEvent: (action, category, label, value) => {
      trackEvent({ action, category, label, value });
      logEvent({ 
        type: 'event', 
        action, 
        category, 
        label, 
        value, 
        timestamp: new Date() 
      });
    },
    
    // E-commerce events
    trackProductView: (product) => {
      trackProductView(product);
      logEvent({ 
        type: 'product_view', 
        product: product.name || product.id,
        price: product.price,
        timestamp: new Date() 
      });
    },
    
    trackAddToCart: (product, quantity) => {
      trackAddToCart(product, quantity);
      logEvent({ 
        type: 'add_to_cart', 
        product: product.name || product.id,
        quantity,
        timestamp: new Date() 
      });
    },
    
    trackCheckoutStep: (step, value) => {
      trackCheckoutStep(step, value);
      logEvent({ 
        type: 'checkout_step', 
        step, 
        value, 
        timestamp: new Date() 
      });
    },
    
    trackPurchase: (order) => {
      trackPurchase(order);
      logEvent({ 
        type: 'purchase', 
        order: order.orderNumber || order.id,
        total: order.total,
        timestamp: new Date() 
      });
    },
    
    // User engagement events
    trackSearch: (searchTerm) => {
      trackSearch(searchTerm);
      logEvent({ 
        type: 'search', 
        term: searchTerm,
        timestamp: new Date() 
      });
    },
    
    trackSignUp: (method) => {
      trackEvent({ action: 'sign_up', category: 'engagement', label: method });
      logEvent({ 
        type: 'sign_up', 
        method,
        timestamp: new Date() 
      });
    },
    
    // Mock data for development
    getMockDashboardData: () => mockData,
    
    // Get recent events (development only)
    getRecentEvents: () => analyticsEvents,
    
    // Clear events (development only)
    clearEvents: () => setAnalyticsEvents([]),
    
    // Toggle debug mode
    toggleDebug: () => {
      const isDebug = localStorage.getItem('analytics_debug') === 'true';
      localStorage.setItem('analytics_debug', !isDebug);
      devLogger.log('Debug mode toggled', { enabled: !isDebug });
    },
  };

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const DevAnalyticsPanel = () => {
  const { getRecentEvents, clearEvents, getMockDashboardData } = useContext(AnalyticsContext);
  const events = getRecentEvents ? getRecentEvents() : [];
  const mockData = getMockDashboardData ? getMockDashboardData() : {};

  if (!getRecentEvents || !getMockDashboardData) {
    return null;
  }
  
  return (
    <div id="dev-analytics-panel" className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50 p-4 hidden border border-gray-200 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">📊 Development Analytics</h3>
        <div className="flex gap-2">
          <button 
            onClick={clearEvents}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Clear
          </button>
          <button 
            onClick={() => document.getElementById('dev-analytics-panel').classList.add('hidden')}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Mock Dashboard Data</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Page Views</div>
              <div className="font-bold">{mockData.pageViews || 0}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Users</div>
              <div className="font-bold">{mockData.users || 0}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Conversion</div>
              <div className="font-bold">{mockData.conversionRate || '0%'}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Revenue</div>
              <div className="font-bold">{mockData.revenue || '₵0'}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Recent Events ({events.length})</h4>
          {events.length === 0 ? (
            <p className="text-xs text-gray-500">No events yet. Interact with the site!</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {events.map((event, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{event.type}</span>
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  {event.product && <div>Product: {event.product}</div>}
                  {event.step && <div>Step: {event.step}</div>}
                  {event.term && <div>Search: {event.term}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          <p>All analytics are logged to console and not sent to Google Analytics.</p>
          <p>In production, this panel will be hidden and real GA will be used.</p>
        </div>
      </div>
    </div>
  );
};
    
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
