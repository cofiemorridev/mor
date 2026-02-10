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
