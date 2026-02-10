import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { AppStateProvider } from './context/AppStateContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import './index.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <AnalyticsProvider>
        <AppStateProvider>
          <AuthProvider>
            <ProductsProvider>
              <CartProvider>
                <div className="App">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/products" element={<Layout><Products /></Layout>} />
                    <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
                    <Route path="/cart" element={<Layout><Cart /></Layout>} />
                    <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                    <Route path="/about" element={<Layout><About /></Layout>} />
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />
                    <Route path="/payment/success" element={<Layout><PaymentSuccess /></Layout>} />
                    <Route path="/payment/failure" element={<Layout><PaymentFailure /></Layout>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<Layout><NotFound /></Layout>} />
                  </Routes>
                </div>
              </CartProvider>
            </ProductsProvider>
          </AuthProvider>
        </AppStateProvider>
      </AnalyticsProvider>
    </Router>
  );
};

export default App;
