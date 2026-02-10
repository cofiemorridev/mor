import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const { trackSearch } = useAnalytics();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Mock products data - in production, fetch from API
  const mockProducts = [
    {
      id: '1',
      name: 'Organic Virgin Coconut Oil',
      description: '100% pure, cold-pressed organic virgin coconut oil. Perfect for cooking, skincare, and haircare.',
      shortDescription: 'Pure cold-pressed coconut oil',
      price: 45.99,
      category: 'cooking',
      image: '/images/virgin-oil.jpg',
      rating: 4.8,
      stock: 50,
      featured: true
    },
    {
      id: '2',
      name: 'Cold Pressed Coconut Oil',
      description: 'Premium cold pressed coconut oil with natural aroma. Ideal for massage and therapeutic uses.',
      shortDescription: 'Premium massage coconut oil',
      price: 39.99,
      category: 'massage',
      image: '/images/cold-pressed.jpg',
      rating: 4.6,
      stock: 75,
      featured: true
    },
    {
      id: '3',
      name: 'Coconut Oil Hair Treatment',
      description: 'Deep conditioning hair treatment with coconut oil for shiny, healthy hair.',
      shortDescription: 'Hair treatment oil',
      price: 32.99,
      category: 'skincare',
      image: '/images/hair-treatment.jpg',
      rating: 4.7,
      stock: 40,
      featured: false
    },
    {
      id: '4',
      name: 'Coconut Cooking Oil',
      description: 'Refined coconut oil perfect for high-heat cooking and frying.',
      shortDescription: 'High-heat cooking oil',
      price: 28.99,
      category: 'cooking',
      image: '/images/cooking-oil.jpg',
      rating: 4.5,
      stock: 100,
      featured: false
    },
    {
      id: '5',
      name: 'Coconut Oil Massage',
      description: 'Therapeutic massage oil blended with essential oils for relaxation.',
      shortDescription: 'Therapeutic massage oil',
      price: 49.99,
      category: 'massage',
      image: '/images/massage-oil.jpg',
      rating: 4.9,
      stock: 30,
      featured: true
    },
    {
      id: '6',
      name: 'Coconut Oil Soap',
      description: 'Natural soap made with coconut oil and essential oils.',
      shortDescription: 'Natural coconut soap',
      price: 12.99,
      category: 'skincare',
      image: '/images/soap.jpg',
      rating: 4.4,
      stock: 120,
      featured: false
    }
  ];

  // Initialize products
  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    // Extract unique categories
    const uniqueCategories = ['all', ...new Set(mockProducts.map(p => p.category))];
    setCategories(uniqueCategories);
    
    setLoading(false);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
      
      // Track search analytics
      if (searchTerm && result.length > 0) {
        trackSearch(searchTerm, result.length);
      }
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default: featured first, then by name
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy, trackSearch]);

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  // Search products
  const searchProducts = (term) => {
    setSearchTerm(term);
  };

  const value = {
    products,
    filteredProducts,
    featuredProducts,
    categories,
    loading,
    searchTerm,
    selectedCategory,
    sortBy,
    getProductById,
    getProductsByCategory,
    searchProducts,
    setSelectedCategory,
    setSortBy,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
