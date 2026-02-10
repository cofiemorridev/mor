import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';

const Navbar = () => {
  const { trackEvent } = useAnalytics();

  const handleNavClick = (page) => {
    trackEvent('navigation_click', 'navigation', page);
  };

  const handleLogoClick = () => {
    trackEvent('logo_click', 'navigation', 'home');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <div className="text-2xl">🥥</div>
            <span className="ml-2 font-bold text-xl text-green-700">Coconut Oil Ghana</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              onClick={() => handleNavClick('home')}
              className="text-gray-700 hover:text-green-600"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => handleNavClick('products')}
              className="text-gray-700 hover:text-green-600"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              onClick={() => handleNavClick('cart')}
              className="text-gray-700 hover:text-green-600"
            >
              Cart 🛒
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
