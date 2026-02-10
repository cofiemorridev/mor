import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pure, Natural Coconut Oil from Ghana
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Experience the authentic taste and benefits of 100% natural, 
              cold-pressed coconut oil. Perfect for cooking, beauty, and wellness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Coconut Oil?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🥥</div>
            <h3 className="text-xl font-semibold mb-3">100% Natural & Pure</h3>
            <p className="text-gray-600">No additives, no preservatives. Just pure coconut goodness.</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">❄️</div>
            <h3 className="text-xl font-semibold mb-3">Cold-Pressed</h3>
            <p className="text-gray-600">Preserves all natural nutrients and flavor.</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-3">Multipurpose Use</h3>
            <p className="text-gray-600">Great for cooking, skincare, haircare, and more.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Pure Coconut Oil?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying our premium coconut oil.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Shop Our Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
