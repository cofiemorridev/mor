import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="h-10 w-32 bg-green-600 flex items-center justify-center rounded">
              <span className="text-white font-bold text-lg">🥥 COCONUT</span>
            </div>
            <p className="text-gray-400">
              Premium coconut oil from Ghana. 100% natural, cold-pressed, and organic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-3">
                📞 <span>+233 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                ✉️ <span>info@coconutoil.com</span>
              </li>
              <li className="flex items-center space-x-3">
                📍 <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h4 className="text-center mb-4">Payment Methods</h4>
          <div className="flex justify-center space-x-6">
            <div className="bg-white p-2 rounded">
              <span className="text-gray-900 font-bold">MTN</span>
            </div>
            <div className="bg-white p-2 rounded">
              <span className="text-gray-900 font-bold">Vodafone</span>
            </div>
            <div className="bg-white p-2 rounded">
              <span className="text-gray-900 font-bold">VISA</span>
            </div>
            <div className="bg-white p-2 rounded">
              <span className="text-gray-900 font-bold">MasterCard</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {currentYear} Coconut Oil Ghana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
