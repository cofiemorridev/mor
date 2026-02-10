import React from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const { featuredProducts, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Premium Coconut Oil Products
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover our collection of 100% natural, cold-pressed coconut oils 
            for cooking, skincare, haircare, and wellness.
          </p>
          <a
            href="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Why Choose Our Coconut Oil?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-xl font-bold mb-2">100% Natural</h3>
            <p className="text-gray-600">No additives, preservatives, or chemicals</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❄️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Cold Pressed</h3>
            <p className="text-gray-600">Preserves natural nutrients and flavor</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free delivery on orders over ₵100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
