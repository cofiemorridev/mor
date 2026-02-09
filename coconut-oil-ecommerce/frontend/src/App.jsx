import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import PageLoader from './components/common/PageLoader';
import './styles/index.css';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages (lazy loaded)
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const AdminProducts = lazy(() => import('./admin/Products'));
const AdminOrders = lazy(() => import('./admin/Orders'));

// Admin Layout
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

// Protected Route Component
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute'));

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AdminAuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <Home />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/products" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <Products />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/products/:id" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <ProductDetail />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/cart" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <Cart />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/checkout" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <Checkout />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/payment/success" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <PaymentSuccess />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/payment/failure" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <PaymentFailure />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/about" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <About />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Suspense fallback={<Loader />}>
                    <Contact />
                  </Suspense>
                </main>
                <Footer />
              </>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <Suspense fallback={<Loader />}>
                <AdminLogin />
              </Suspense>
            } />
            
            <Route path="/admin" element={
              <Suspense fallback={<Loader />}>
                <AdminLayout />
              </Suspense>
            }>
              <Route path="dashboard" element={
                <Suspense fallback={<Loader />}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Suspense>
              } />
              <Route path="products" element={
                <Suspense fallback={<Loader />}>
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                </Suspense>
              } />
              <Route path="orders" element={
                <Suspense fallback={<Loader />}>
                  <ProtectedRoute>
                    <AdminOrders />
                  </ProtectedRoute>
                </Suspense>
              } />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;
