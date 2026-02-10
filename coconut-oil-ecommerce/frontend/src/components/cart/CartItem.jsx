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
