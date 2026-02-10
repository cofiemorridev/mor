import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { trackAddToCart, trackEvent } = useAnalytics();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('coconutOilCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coconutOilCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '/images/oil-bottle.png',
          quantity: quantity,
          category: product.category
        }];
      }
    });

    // Track analytics event
    trackAddToCart(product.id, product.name, quantity, product.price);
    
    // Open cart when item is added
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (productId, productName, price) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // Track analytics event
    trackEvent({
      action: 'remove_from_cart',
      category: 'ecommerce',
      label: productName,
      value: price
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      const item = cartItems.find(i => i.id === productId);
      if (item) {
        removeFromCart(productId, item.name, item.price);
      }
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    trackEvent({
      action: 'clear_cart',
      category: 'ecommerce',
      label: 'User cleared cart'
    });
    setCartItems([]);
  };

  // Checkout function
  const checkout = () => {
    trackEvent({
      action: 'begin_checkout',
      category: 'ecommerce',
      label: `Cart with ${itemCount} items`,
      value: cartTotal
    });
    
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    cartTotal,
    itemCount,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
