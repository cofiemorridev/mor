import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const Footer = () => {
  const { trackEvent } = useAnalytics();

  const handleLinkClick = (linkType) => {
    trackEvent('footer_link_click', 'navigation', linkType);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Coconut Oil Ghana</h3>
            <p className="text-gray-400">
              Premium coconut oil products from Ghana. 
              100% natural, cold-pressed, and sustainably sourced.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/products" 
                  onClick={() => handleLinkClick('products')}
                  className="text-gray-400 hover:text-white"
                >
                  Products
                </a>
              </li>
              <li>
                <a 
                  href="/cart" 
                  onClick={() => handleLinkClick('cart')}
                  className="text-gray-400 hover:text-white"
                >
                  Shopping Cart
                </a>
              </li>
              <li>
                <a 
                  href="/checkout" 
                  onClick={() => handleLinkClick('checkout')}
                  className="text-gray-400 hover:text-white"
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 contact@coconutoil.com</li>
              <li>📞 +233 123 456 789</li>
              <li>📍 Accra, Ghana</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Coconut Oil Ghana. All rights reserved.</p>
          <p className="text-sm mt-2">This site uses development analytics for testing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
