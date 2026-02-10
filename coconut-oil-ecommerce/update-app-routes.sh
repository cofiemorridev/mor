#!/bin/bash

cd frontend

# Check if App.jsx exists
if [ -f "src/App.jsx" ]; then
  echo "Updating App.jsx with new routes..."
  
  # Create a new App.jsx with all routes
  cat > src/App.jsx << 'APP'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalyticsProvider, DevAnalyticsPanel } from './context/AnalyticsContext';
import './App.css';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './components/product/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

// Import common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  // Mock product for testing ProductDetail
  const mockProduct = {
    id: 1,
    name: 'Pure Coconut Oil',
    description: '100% natural cold-pressed coconut oil from Ghana. Perfect for cooking, skin care, and hair treatment.',
    shortDescription: '100% natural cold-pressed coconut oil',
    price: 25.99,
    comparePrice: 29.99,
    volume: '500ml',
    images: ['/images/oil-bottle.png'],
    benefits: ['Rich in antioxidants', 'Natural moisturizer', 'Supports heart health'],
    ingredients: ['100% Pure Coconut Oil'],
    usage: 'Use for cooking, skin moisturizing, or hair treatment.',
    rating: 4.5,
    reviewCount: 128,
    stockQuantity: 15
  };

  return (
    <AnalyticsProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail product={mockProduct} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      {import.meta.env.DEV && <DevAnalyticsPanel />}
    </AnalyticsProvider>
  );
}

export default App;
APP
  
  echo "✅ App.jsx updated with all routes"
else
  echo "❌ App.jsx not found"
fi
