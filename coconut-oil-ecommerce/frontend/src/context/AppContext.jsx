import React from 'react';
import { AnalyticsProvider } from './AnalyticsContext';
import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';
import { ProductsProvider } from './ProductsContext';

export const AppProvider = ({ children }) => {
  return (
    <AnalyticsProvider>
      <UserProvider>
        <ProductsProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ProductsProvider>
      </UserProvider>
    </AnalyticsProvider>
  );
};

export default AppProvider;
