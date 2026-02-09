import React from 'react';
import SEO from '../components/common/SEO';
import { getPageSEOConfig } from '../utils/seoUtils';
import OptimizedImage from '../components/common/OptimizedImage';
import { Link } from 'react-router-dom';

const Home = () => {
  const seoConfig = getPageSEOConfig('home');

  const featuredProducts = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      price: 25.00,
      volume: '500ml',
      image: '/images/oil-bottle.png',
      rating: 4.8,
      description: '100% pure, natural coconut oil'
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      price: 45.00,
      volume: '1L',
      image: '/images/oil-bottle.png',
      rating: 4.9,
      description: 'Premium virgin coconut oil'
    }
  ];

  const features = [
    {
      icon: '🥥',
      title: '100% Natural & Pure',
      description: 'No additives or preservatives'
    },
    {
      icon: '❄️',
      title: 'Cold-Pressed',
      description: 'Retains all natural nutrients'
    },
    {
      icon: '💚',
      title: 'Rich in Nutrients',
      description: 'Packed with vitamins and antioxidants'
    },
    {
      icon: '✨',
      title: 'Multipurpose Use',
      description: 'For cooking, skincare, and haircare'
    }
  ];

  return (
    <>
      <SEO {...seoConfig} />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/images/hero-coconut.jpg"
            alt="Coconut plantation in Ghana"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fadeIn">
              Pure, Natural Coconut Oil
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-green-100">
              Experience the authentic taste and benefits of 100% natural coconut oil from Ghana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Link>
              <Link 
                to="/about"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white/30 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-800">
            Why Choose Our Coconut Oil?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-green-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800">Our Best Sellers</h2>
            <Link 
              to="/products"
              className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white border border-green-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden h-64">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-green-800">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-700">₵{product.price.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">{product.volume}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex text-amber-400 mr-2">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/products/${product.id}`}
                    className="mt-6 block w-full bg-green-50 hover:bg-green-100 text-green-700 text-center py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
                Our Story & Commitment
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  At Coconut Oil Ghana, we're passionate about bringing you the purest, most natural coconut oil 
                  straight from the heart of Ghana's coconut plantations.
                </p>
                <p>
                  Our journey began with a simple mission: to preserve traditional extraction methods while 
                  maintaining the highest quality standards. Every bottle of our coconut oil is carefully 
                  cold-pressed to retain all the natural nutrients and authentic flavor.
                </p>
                <p>
                  We work directly with local farmers, ensuring fair trade practices and supporting sustainable 
                  agriculture that benefits both our community and our customers.
                </p>
              </div>
              <Link 
                to="/about"
                className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Read Our Full Story
              </Link>
            </div>
            <div className="relative">
              <OptimizedImage
                src="/images/coconut-plantation.jpg"
                alt="Coconut plantation in Ghana"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg max-w-xs">
                <div className="text-green-600 font-bold text-lg">🌟 Quality Guaranteed</div>
                <p className="text-gray-600 mt-2">100% natural, no additives, cold-pressed perfection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🌿</div>
              <div className="font-bold text-lg">100% Natural</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🇬🇭</div>
              <div className="font-bold text-lg">Ghana Made</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-bold text-lg">Quality Guaranteed</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <div className="font-bold text-lg">Nationwide Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Pure Coconut Oil?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Join thousands of satisfied customers who've discovered the benefits of our premium coconut oil
          </p>
          <Link 
            to="/products"
            className="inline-block bg-white text-green-700 hover:bg-green-50 px-10 py-4 rounded-lg text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Shop Premium Coconut Oil
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
