import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import ProductCard from '../components/product/ProductCard';
import SearchBar from '../components/search/SearchBar';

const Products = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      shortDescription: '100% natural cold-pressed coconut oil',
      price: 25.99,
      comparePrice: 29.99,
      image: '/images/oil-bottle.png',
      category: 'pure',
      featured: true,
      rating: 4.5,
      stockQuantity: 15
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      shortDescription: 'Premium extra virgin coconut oil',
      price: 32.99,
      comparePrice: 36.99,
      image: '/images/oil-bottle.png',
      category: 'virgin',
      featured: true,
      rating: 4.8,
      stockQuantity: 8
    },
    {
      id: 3,
      name: 'Organic Coconut Oil',
      shortDescription: 'Certified organic coconut oil',
      price: 28.50,
      image: '/images/oil-bottle.png',
      category: 'organic',
      featured: false,
      rating: 4.3,
      stockQuantity: 20
    },
    {
      id: 4,
      name: 'Coconut Oil for Hair',
      shortDescription: 'Special blend for hair care',
      price: 22.99,
      comparePrice: 26.99,
      image: '/images/oil-bottle.png',
      category: 'hair',
      featured: true,
      rating: 4.6,
      stockQuantity: 12
    },
    {
      id: 5,
      name: 'Coconut Oil for Skin',
      shortDescription: 'Moisturizing skin treatment oil',
      price: 24.99,
      image: '/images/oil-bottle.png',
      category: 'skin',
      featured: false,
      rating: 4.4,
      stockQuantity: 18
    },
    {
      id: 6,
      name: 'Cooking Coconut Oil',
      shortDescription: 'High heat cooking coconut oil',
      price: 19.99,
      comparePrice: 23.99,
      image: '/images/oil-bottle.png',
      category: 'cooking',
      featured: true,
      rating: 4.7,
      stockQuantity: 25
    },
  ];

  useEffect(() => {
    trackPageView('/products');
    trackEvent('view_product_list', 'ecommerce', 'all_products', mockProducts.length);
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let result = products;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
      }
    });
    
    setFilteredProducts(result);
    
    // Track filtering
    if (searchQuery || selectedCategory !== 'all') {
      trackEvent('products_filtered', 'engagement', \`search:\${searchQuery}, category:\${selectedCategory}, sort:\${sortBy}\`, result.length);
    }
  }, [searchQuery, selectedCategory, sortBy, products]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      trackEvent('product_search', 'search', query);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    trackEvent('category_filter', 'navigation', category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    trackEvent('sort_changed', 'engagement', sort);
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'pure', label: 'Pure Coconut Oil' },
    { id: 'virgin', label: 'Virgin Coconut Oil' },
    { id: 'organic', label: 'Organic' },
    { id: 'hair', label: 'For Hair' },
    { id: 'skin', label: 'For Skin' },
    { id: 'cooking', label: 'Cooking' },
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="products-page max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Coconut Oil Products</h1>
        <p className="text-gray-600">Discover our range of premium coconut oils for cooking, beauty, and health.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} placeholder="Search coconut oil products..." />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${selectedCategory === category.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="text-sm text-gray-500">
            {searchQuery && \`Results for "\${searchQuery}"\`}
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                trackEvent('reset_filters', 'engagement', 'reset_all');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our Coconut Oil?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="font-semibold text-lg mb-2">100% Natural</h3>
            <p className="text-gray-600">No additives or preservatives</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">❄️</div>
            <h3 className="font-semibold text-lg mb-2">Cold-Pressed</h3>
            <p className="text-gray-600">Preserves nutrients and flavor</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-3">🇬🇭</div>
            <h3 className="font-semibold text-lg mb-2">Made in Ghana</h3>
            <p className="text-gray-600">Supporting local farmers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
