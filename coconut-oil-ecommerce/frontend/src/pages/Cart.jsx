import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { trackPageView, trackEvent, getMockDashboardData } = useAnalytics();
  const [cartItems, setCartItems] = useState([]);

  // Mock cart data for development
  const mockProducts = [
    {
      id: 1,
      productId: 'prod-001',
      name: 'Pure Coconut Oil',
      image: '/images/oil-bottle.png',
      price: 25.99,
      quantity: 2,
      volume: '500ml'
    },
    {
      id: 2,
      productId: 'prod-002',
      name: 'Virgin Coconut Oil',
      image: '/images/oil-bottle.png',
      price: 32.99,
      quantity: 1,
      volume: '500ml'
    }
  ];

  useEffect(() => {
    // Track page view
    trackPageView('/cart');
    
    // Load cart items (mock for now)
    setCartItems(mockProducts);
    
    // Track cart view with item count
    trackEvent('view_cart', 'ecommerce', '', mockProducts.length);
    
    // Track cart value
    const cartValue = mockProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    trackEvent('cart_value', 'ecommerce', 'cart_view', cartValue);
  }, []);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      trackEvent('cart_item_removed', 'ecommerce', item.name, item.price);
    }
    
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    trackEvent('checkout_initiated', 'ecommerce', '', cartItems.length);
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 10;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page max-w-6xl mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            onClick={() => trackEvent('empty_cart_click', 'navigation', 'browse_products')}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Items ({cartItems.length})
                </h2>
                <button
                  onClick={() => {
                    trackEvent('clear_cart', 'ecommerce', 'clear_all');
                    setCartItems([]);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div>
          <CartSummary
            items={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Recently Viewed (Mock) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">🥥</div>
              <div className="font-medium text-gray-800">Coconut Oil {i}</div>
              <div className="text-green-700 font-semibold">₵{19.99 + i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
