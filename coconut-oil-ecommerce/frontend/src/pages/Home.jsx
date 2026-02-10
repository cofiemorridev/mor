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
