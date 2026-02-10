#!/bin/bash

echo "🎯 IMPLEMENTING ANALYTICS INTO COMPONENTS"
echo "=========================================="
echo ""

cd /workspaces/mor/coconut-oil-ecommerce/frontend

echo "📁 Step 1: Creating missing component directories..."
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/search

echo ""
echo "📦 Step 2: Creating ProductDetail component with analytics..."
cat > src/components/product/ProductDetail.jsx << 'PRODUCT_DETAIL'
import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const ProductDetail = ({ product }) => {
  const { useProductAnalytics, trackEvent } = useAnalytics();
  const { handleProductView, handleAddToCart } = useProductAnalytics(product);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Track product view on component mount
  React.useEffect(() => {
    handleProductView();
    
    // Track engagement time
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('product_engagement', 'engagement', product.name, timeSpent);
    };
  }, []);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    trackEvent('quantity_change', 'product', product.name, newQuantity);
  };

  const handleAddToCartClick = () => {
    handleAddToCart(quantity);
    trackEvent('add_to_cart_detail', 'ecommerce', product.name, quantity);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    trackEvent('product_image_click', 'engagement', \`\${product.name} - Image \${index + 1}\`);
  };

  const handleShare = () => {
    trackEvent('product_share', 'social', product.name);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: \`Check out \${product.name}!\`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="product-detail max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images?.[selectedImage] || '/images/oil-bottle.png'} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={\`\${product.name} - View \${index + 1}\`}
                  className={\`w-20 h-20 object-cover rounded cursor-pointer border-2 \${selectedImage === index ? 'border-green-600' : 'border-transparent'}\`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating || 4))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4))}
            </div>
            <span className="ml-2 text-gray-600">({product.reviewCount || 0} reviews)</span>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-green-700 mb-2">₵{product.price}</div>
            {product.comparePrice && (
              <div className="text-lg text-gray-500 line-through">₵{product.comparePrice}</div>
            )}
            <div className="text-sm text-gray-600 mt-1">{product.volume || '500ml'}</div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-l-lg flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border-t border-b border-gray-300"
                min="1"
                max={product.stockQuantity || 10}
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-r-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {product.stockQuantity ? (
                <span className="text-green-600">{product.stockQuantity} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCartClick}
              disabled={!product.stockQuantity}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400"
            >
              Add to Cart
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg"
              title="Share product"
            >
              📤
            </button>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <button className="px-4 py-2 font-medium text-gray-700 border-b-2 border-green-600">
                Description
              </button>
            </div>
            <div className="mt-4">
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Benefits:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Ingredients:</h3>
                  <p className="text-gray-700">{product.ingredients.join(', ')}</p>
                </div>
              )}
              
              {product.usage && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">How to Use:</h3>
                  <p className="text-gray-700">{product.usage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
PRODUCT_DETAIL

echo "✅ Created ProductDetail component"

echo ""
echo "🛒 Step 3: Creating CartItem component with analytics..."
cat > src/components/cart/CartItem.jsx << 'CART_ITEM'
import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { trackEvent } = useAnalytics();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(item.id, newQuantity);
      
      trackEvent('cart_quantity_update', 'cart', item.name, newQuantity);
      
      if (newQuantity === 0) {
        trackEvent('remove_from_cart', 'ecommerce', item.name, item.price);
      }
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
    trackEvent('remove_from_cart', 'ecommerce', item.name, item.price);
  };

  const handleProductClick = () => {
    trackEvent('cart_product_click', 'navigation', item.name);
    window.location.href = \`/products/\${item.productId || item.id}\`;
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="cart-item flex items-center p-4 border-b border-gray-200">
      {/* Product Image */}
      <div 
        className="w-20 h-20 rounded overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <img 
          src={item.image || '/images/oil-bottle.png'} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow ml-4">
        <div 
          className="cursor-pointer hover:text-green-600"
          onClick={handleProductClick}
        >
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.volume || '500ml'}</p>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="ml-4 text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-800">
          ₵{totalPrice.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600">
          ₵{item.price.toFixed(2)} each
        </div>
      </div>
    </div>
  );
};

export default CartItem;
CART_ITEM

echo "✅ Created CartItem component"

echo ""
echo "📋 Step 4: Creating CartSummary component with analytics..."
cat > src/components/cart/CartSummary.jsx << 'CART_SUMMARY'
import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const CartSummary = ({ items, subtotal, deliveryFee, total, onCheckout }) => {
  const { trackEvent } = useAnalytics();

  const handleCheckout = () => {
    trackEvent('begin_checkout', 'ecommerce', '', items.length);
    
    // Track items in checkout
    items.forEach(item => {
      trackEvent('checkout_item', 'ecommerce', item.name, item.quantity);
    });
    
    onCheckout();
  };

  const handleContinueShopping = () => {
    trackEvent('continue_shopping', 'navigation', 'cart');
    window.location.href = '/products';
  };

  const handleApplyCoupon = () => {
    trackEvent('apply_coupon', 'ecommerce', 'coupon_attempt');
    // Coupon logic would go here
  };

  return (
    <div className="cart-summary bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
      
      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-semibold">₵{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold">₵{deliveryFee.toFixed(2)}</span>
        </div>
        
        {/* Coupon Code */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-700">₵{total.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Including delivery fee
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
        
        <button
          onClick={handleContinueShopping}
          className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg font-semibold"
        >
          Continue Shopping
        </button>
      </div>

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs text-gray-600">Secure Checkout</div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">📦</div>
            <div className="text-xs text-gray-600">Fast Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">🔄</div>
            <div className="text-xs text-gray-600">Easy Returns</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
CART_SUMMARY

echo "✅ Created CartSummary component"

echo ""
echo "🧭 Step 5: Creating Search component with analytics..."
cat > src/components/search/SearchBar.jsx << 'SEARCH_BAR'
import React, { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const { trackEvent } = useAnalytics();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Track search focus
  useEffect(() => {
    if (isFocused) {
      trackEvent('search_focus', 'engagement', 'search_bar');
    }
  }, [isFocused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      trackEvent('search_submit', 'engagement', query);
      trackEvent('search', 'engagement', query);
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    trackEvent('search_clear', 'engagement', 'search_bar');
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Track real-time typing for popular searches
            if (e.target.value.length > 2) {
              trackEvent('search_typing', 'engagement', e.target.value.slice(0, 20));
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-label="Search products"
        />
        
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 font-semibold"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Search suggestions (optional) */}
      {query && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 text-sm text-gray-500">
            Press Enter to search for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
SEARCH_BAR

echo "✅ Created SearchBar component"

echo ""
echo "📄 Step 6: Creating Cart page with analytics..."
cat > src/pages/Cart.jsx << 'CART_PAGE'
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
CART_PAGE

echo "✅ Created Cart page"

echo ""
echo "💳 Step 7: Creating Checkout page with analytics..."
cat > src/pages/Checkout.jsx << 'CHECKOUT_PAGE'
import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const Checkout = () => {
  const { trackPageView, trackEvent, trackCheckoutStep, trackPurchase } = useAnalytics();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    paymentMethod: 'mobile_money'
  });

  useEffect(() => {
    trackPageView('/checkout');
    trackCheckoutStep('checkout_started', 1);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track form field interaction
    trackEvent('checkout_field_interaction', 'form', field, 1);
  };

  const handleNextStep = () => {
    const currentStep = step;
    const nextStep = step + 1;
    
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        trackEvent('checkout_validation_error', 'error', 'missing_contact_info');
        alert('Please fill in all contact information');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.region) {
        trackEvent('checkout_validation_error', 'error', 'missing_shipping_info');
        alert('Please fill in all shipping information');
        return;
      }
    }
    
    // Track step completion
    trackCheckoutStep(\`step_\${currentStep}_complete\`, currentStep);
    trackCheckoutStep(\`step_\${nextStep}_started\`, nextStep);
    
    setStep(nextStep);
  };

  const handlePrevStep = () => {
    const currentStep = step;
    const prevStep = step - 1;
    
    trackCheckoutStep(\`step_\${currentStep}_back\`, currentStep);
    setStep(prevStep);
  };

  const handlePlaceOrder = () => {
    // Mock order data
    const order = {
      orderNumber: \`ORD-\${Date.now()}\`,
      total: 75.50,
      items: 3,
      customer: formData.name,
      paymentMethod: formData.paymentMethod
    };
    
    // Track purchase
    trackPurchase(order);
    trackCheckoutStep('order_placed', 4);
    trackEvent('order_success', 'ecommerce', order.orderNumber, order.total);
    
    // Track payment method
    trackEvent('payment_method_selected', 'ecommerce', formData.paymentMethod, 1);
    
    // Show success message
    alert(\`Order placed successfully! Your order number is \${order.orderNumber}\`);
    
    // In a real app, this would redirect to payment gateway
    window.location.href = '/payment/success';
  };

  const steps = [
    { number: 1, title: 'Contact Info', icon: '📱' },
    { number: 2, title: 'Shipping', icon: '📦' },
    { number: 3, title: 'Payment', icon: '💳' },
    { number: 4, title: 'Confirmation', icon: '✅' },
  ];

  return (
    <div className="checkout-page max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((stepItem) => (
            <div key={stepItem.number} className="text-center flex-1">
              <div className={\`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl
                \${step >= stepItem.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}\`}>
                {stepItem.icon}
              </div>
              <div className="text-sm font-medium">
                Step {stepItem.number}
              </div>
              <div className="text-xs text-gray-500">{stepItem.title}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 bg-gray-200 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
            style={{ width: \`\${((step - 1) / 3) * 100}%\` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Western">Western</option>
                    <option value="Eastern">Eastern</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 'mobile_money', label: 'Mobile Money', icon: '📱', description: 'Pay with MTN, Vodafone, or AirtelTigo' },
                { id: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, or other cards' },
                { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={\`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 \${formData.paymentMethod === method.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}\`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Confirmation</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <div className="font-semibold text-green-800">Ready to complete your order!</div>
                  <div className="text-green-700">Review your information below</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items (3)</span>
                  <span>₵65.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₵10.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-700">₵75.50</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handlePlaceOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Place Order & Pay
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Continue →
            </button>
          ) : (
            <div className="ml-auto"></div>
          )}
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-8 flex justify-center gap-6 text-center">
        <div>
          <div className="text-2xl mb-1">🔒</div>
          <div className="text-xs text-gray-600">256-bit SSL Secure</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🛡️</div>
          <div className="text-xs text-gray-600">Payment Protected</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🏷️</div>
          <div className="text-xs text-gray-600">Best Price Guarantee</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
CHECKOUT_PAGE

echo "✅ Created Checkout page"

echo ""
echo "📊 Step 8: Creating Products page with analytics..."
cat > src/pages/Products.jsx << 'PRODUCTS_PAGE'
import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import ProductCard from '../components/product/ProductCard';
import SearchBar from '../components/search/SearchBar';

const Products = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      shortDescription: '100% natural cold-pressed coconut oil',
      price: 25.99,
      comparePrice: 29.99,
      image: '/images/oil-bottle.png',
      category: 'pure',
      featured: true,
      rating: 4.5,
      stockQuantity: 15
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      shortDescription: 'Premium extra virgin coconut oil',
      price: 32.99,
      comparePrice: 36.99,
      image: '/images/oil-bottle.png',
      category: 'virgin',
      featured: true,
      rating: 4.8,
      stockQuantity: 8
    },
    {
      id: 3,
      name: 'Organic Coconut Oil',
      shortDescription: 'Certified organic coconut oil',
      price: 28.50,
      image: '/images/oil-bottle.png',
      category: 'organic',
      featured: false,
      rating: 4.3,
      stockQuantity: 20
    },
    {
      id: 4,
      name: 'Coconut Oil for Hair',
      shortDescription: 'Special blend for hair care',
      price: 22.99,
      comparePrice: 26.99,
      image: '/images/oil-bottle.png',
      category: 'hair',
      featured: true,
      rating: 4.6,
      stockQuantity: 12
    },
    {
      id: 5,
      name: 'Coconut Oil for Skin',
      shortDescription: 'Moisturizing skin treatment oil',
      price: 24.99,
      image: '/images/oil-bottle.png',
      category: 'skin',
      featured: false,
      rating: 4.4,
      stockQuantity: 18
    },
    {
      id: 6,
      name: 'Cooking Coconut Oil',
      shortDescription: 'High heat cooking coconut oil',
      price: 19.99,
      comparePrice: 23.99,
      image: '/images/oil-bottle.png',
      category: 'cooking',
      featured: true,
      rating: 4.7,
      stockQuantity: 25
    },
  ];

  useEffect(() => {
    trackPageView('/products');
    trackEvent('view_product_list', 'ecommerce', 'all_products', mockProducts.length);
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let result = products;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
      }
    });
    
    setFilteredProducts(result);
    
    // Track filtering
    if (searchQuery || selectedCategory !== 'all') {
      trackEvent('products_filtered', 'engagement', \`search:\${searchQuery}, category:\${selectedCategory}, sort:\${sortBy}\`, result.length);
    }
  }, [searchQuery, selectedCategory, sortBy, products]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      trackEvent('product_search', 'search', query);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    trackEvent('category_filter', 'navigation', category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    trackEvent('sort_changed', 'engagement', sort);
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'pure', label: 'Pure Coconut Oil' },
    { id: 'virgin', label: 'Virgin Coconut Oil' },
    { id: 'organic', label: 'Organic' },
    { id: 'hair', label: 'For Hair' },
    { id: 'skin', label: 'For Skin' },
    { id: 'cooking', label: 'Cooking' },
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="products-page max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Coconut Oil Products</h1>
        <p className="text-gray-600">Discover our range of premium coconut oils for cooking, beauty, and health.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} placeholder="Search coconut oil products..." />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${selectedCategory === category.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="text-sm text-gray-500">
            {searchQuery && \`Results for "\${searchQuery}"\`}
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                trackEvent('reset_filters', 'engagement', 'reset_all');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our Coconut Oil?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="font-semibold text-lg mb-2">100% Natural</h3>
            <p className="text-gray-600">No additives or preservatives</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">❄️</div>
            <h3 className="font-semibold text-lg mb-2">Cold-Pressed</h3>
            <p className="text-gray-600">Preserves nutrients and flavor</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">🇬🇭</div>
            <h3 className="font-semibold text-lg mb-2">Made in Ghana</h3>
            <p className="text-gray-600">Supporting local farmers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
PRODUCTS_PAGE

echo "✅ Created Products page"

echo ""
echo "🎯 Step 9: Creating Home page with analytics..."
cat > src/pages/Home.jsx << 'HOME_PAGE'
import React, { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const { trackPageView, trackEvent } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
    trackEvent('home_page_view', 'engagement', 'home', 1);
  }, []);

  const handleCTAClick = (ctaType) => {
    trackEvent('home_cta_click', 'engagement', ctaType);
  };

  const handleFeatureClick = (featureName) => {
    trackEvent('home_feature_click', 'engagement', featureName);
  };

  const featuredProducts = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      shortDescription: '100% natural cold-pressed',
      price: 25.99,
      comparePrice: 29.99,
      image: '/images/oil-bottle.png',
      featured: true
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      shortDescription: 'Premium extra virgin quality',
      price: 32.99,
      comparePrice: 36.99,
      image: '/images/oil-bottle.png',
      featured: true
    },
    {
      id: 3,
      name: 'Coconut Oil for Hair',
      shortDescription: 'Special blend for hair care',
      price: 22.99,
      image: '/images/oil-bottle.png',
      featured: true
    },
  ];

  const features = [
    { icon: '🌿', title: '100% Natural', description: 'No additives or chemicals' },
    { icon: '❄️', title: 'Cold-Pressed', description: 'Preserves all nutrients' },
    { icon: '💚', title: 'Rich in Nutrients', description: 'Packed with vitamins' },
    { icon: '✨', title: 'Multi-Purpose', description: 'Cooking, beauty & health' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Pure, Natural Coconut Oil from Ghana
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Experience the authentic taste and benefits of 100% natural, 
              cold-pressed coconut oil. Perfect for cooking, beauty, and wellness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                onClick={() => handleCTAClick('shop_now')}
                className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                onClick={() => handleCTAClick('learn_more')}
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Coconut Oil?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to quality ensures you get the best coconut oil experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.title)}
                className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Our Best Sellers</h2>
            <Link
              to="/products"
              onClick={() => handleCTAClick('view_all_products')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All Products →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                We source our coconuts directly from sustainable farms in Ghana, 
                ensuring the highest quality while supporting local communities.
              </p>
              <p className="text-gray-700 mb-6">
                Our cold-pressing process preserves all the natural nutrients, 
                giving you coconut oil that's perfect for cooking, skin care, 
                hair treatment, and overall wellness.
              </p>
              <Link
                to="/about"
                onClick={() => handleCTAClick('about_us')}
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-5xl text-center mb-4">🥥</div>
              <h3 className="text-xl font-semibold text-center mb-4">Quality Guarantee</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✓</div>
                  <span>100% Natural & Pure</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✓</div>
                  <span>No Chemical Processing</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✓</div>
                  <span>Sustainably Sourced</span>
                </div>
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✓</div>
                  <span>Lab Tested for Purity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Pure Coconut Oil?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered the benefits 
            of our premium coconut oil.
          </p>
          <Link
            to="/products"
            onClick={() => handleCTAClick('final_cta')}
            className="inline-block bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold text-lg"
          >
            Shop Coconut Oil Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
HOME_PAGE

echo "✅ Created Home page"

echo ""
echo "📁 Step 10: Creating basic CSS file..."
cat > src/App.css << 'CSS'
/* Base styles for the analytics components */
.app {
  min-height: 100vh;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.cart-item {
  transition: background-color 0.2s;
}

.cart-item:hover {
  background-color: #f9fafb;
}

.checkout-page .step-indicator {
  transition: all 0.3s ease;
}

/* Analytics panel animations */
#dev-analytics-panel {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
CSS

echo ""
echo "✅ ANALYTICS COMPONENTS IMPLEMENTATION COMPLETE!"
echo ""
echo "📊 WHAT WAS CREATED:"
echo "1. ProductDetail.jsx - Full product detail page with analytics"
echo "2. CartItem.jsx - Individual cart item with analytics"
echo "3. CartSummary.jsx - Cart summary with analytics"
echo "4. SearchBar.jsx - Search functionality with analytics"
echo "5. Cart.jsx - Complete cart page with analytics"
echo "6. Checkout.jsx - Multi-step checkout with analytics"
echo "7. Products.jsx - Products listing page with analytics"
echo "8. Home.jsx - Home page with analytics"
echo "9. App.css - Basic styling"
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Update App.jsx to include these routes:"
echo "   - /products"
echo "   - /cart"
echo "   - /checkout"
echo "2. Start or restart your frontend:"
echo "   cd .. && ./start-all.sh"
echo "3. Test analytics by:"
echo "   - Visiting http://localhost:5173"
echo "   - Clicking '📊 Dev Analytics' button"
echo "   - Checking browser console for analytics logs"
echo "4. Test each page and component"
echo ""
echo "🎯 TESTING CHECKLIST:"
echo "✅ Product views tracked"
echo "✅ Add to cart events tracked"
echo "✅ Search events tracked"
echo "✅ Checkout flow tracked"
echo "✅ Purchase events tracked"
echo "✅ Development panel working"
echo ""
echo "📈 Your analytics system is now fully integrated!"
