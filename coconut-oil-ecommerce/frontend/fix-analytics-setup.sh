#!/bin/bash

echo "🔧 FIXING ANALYTICS SETUP"
echo "=========================="

cd /workspaces/mor/coconut-oil-ecommerce

echo "1. Stopping services..."
./stop-all.sh

echo ""
echo "2. Checking and creating missing directories..."
mkdir -p frontend/src/utils
mkdir -p frontend/src/hooks
mkdir -p frontend/src/context
mkdir -p frontend/src/components/product
mkdir -p frontend/src/components/cart
mkdir -p frontend/src/components/checkout
mkdir -p frontend/src/components/search
mkdir -p frontend/src/pages
mkdir -p frontend/src/styles

echo ""
echo "3. Creating essential missing files..."

# Create analytics.js if missing
if [ ! -f "frontend/src/utils/analytics.js" ]; then
  echo "   Creating analytics.js..."
  cat > frontend/src/utils/analytics.js << 'ANALYTICS'
// Basic analytics for development
export const devLogger = {
  log: (event, data) => {
    console.log(\`📊 [Analytics Dev] \${event}:\`, data);
  }
};

export const trackPageView = (url) => {
  devLogger.log('Page View', { url });
};

export const trackEvent = ({ action, category, label, value }) => {
  devLogger.log('Event Tracked', { action, category, label, value });
};

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
    label: \`Order \${order.orderNumber || order.id}\`,
    value: order.total || 0
  });
};

export const trackSearch = (searchTerm) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm
  });
};

export const getMockAnalyticsData = () => ({
  pageViews: 1245,
  users: 892,
  conversionRate: '4.2%',
  revenue: '₵8,450'
});
ANALYTICS
fi

# Create useAnalytics.js if missing
if [ ! -f "frontend/src/hooks/useAnalytics.js" ]; then
  echo "   Creating useAnalytics.js..."
  cat > frontend/src/hooks/useAnalytics.js << 'HOOK'
import { useAnalytics as useAnalyticsContext } from '../context/AnalyticsContext';

export const useAnalytics = () => {
  const analytics = useAnalyticsContext();
  
  const useProductAnalytics = (product) => ({
    handleProductView: () => analytics.trackProductView(product),
    handleAddToCart: (quantity = 1) => analytics.trackAddToCart(product, quantity)
  });
  
  const useCheckoutAnalytics = () => ({
    trackStep: (stepNumber, stepName) => analytics.trackCheckoutStep(stepName, stepNumber),
    trackPurchase: (order) => analytics.trackPurchase(order)
  });
  
  return {
    ...analytics,
    useProductAnalytics,
    useCheckoutAnalytics,
  };
};
HOOK
fi

echo ""
echo "4. Creating minimal ProductCard component if missing..."
if [ ! -f "frontend/src/components/product/ProductCard.jsx" ]; then
  cat > frontend/src/components/product/ProductCard.jsx << 'CARD'
import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const ProductCard = ({ product }) => {
  const { useProductAnalytics } = useAnalytics();
  const { handleProductView, handleAddToCart } = useProductAnalytics(product);

  return (
    <div className="bg-white p-4 rounded shadow">
      <img src={product.image || '/images/oil-bottle.png'} alt={product.name} className="w-full h-48 object-cover" />
      <h3>{product.name}</h3>
      <p>₵{product.price}</p>
      <button onClick={() => handleAddToCart(1)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
CARD
fi

echo ""
echo "5. Checking App.jsx..."
if [ ! -f "frontend/src/App.jsx" ]; then
  echo "   Creating basic App.jsx..."
  cat > frontend/src/App.jsx << 'APP'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <AnalyticsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </AnalyticsProvider>
  );
}

export default App;
APP
fi

echo ""
echo "6. Installing dependencies if needed..."
cd frontend
if [ ! -d "node_modules" ]; then
  echo "   Installing npm packages..."
  npm install
fi
cd ..

echo ""
echo "✅ Fix complete!"
echo ""
echo "🚀 Next: Start services and test"
echo "   ./start-all.sh"
echo "   Then visit: http://localhost:5173"
