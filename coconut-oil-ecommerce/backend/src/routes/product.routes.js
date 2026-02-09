const express = require('express');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      price: 25.00,
      volume: '500ml',
      category: 'Pure Coconut Oil',
      inStock: true,
      stockQuantity: 100,
      images: ['/images/oil-bottle.png'],
      description: '100% pure, natural coconut oil from Ghana.',
      shortDescription: 'Pure coconut oil for cooking and beauty',
      benefits: ['Natural', 'Healthy', 'Multipurpose'],
      featured: true,
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      price: 45.00,
      volume: '1L',
      category: 'Virgin Coconut Oil',
      inStock: true,
      stockQuantity: 75,
      images: ['/images/oil-bottle.png'],
      description: 'Premium virgin coconut oil, cold-pressed.',
      shortDescription: 'High-quality virgin coconut oil',
      benefits: ['Premium quality', 'Cold-pressed', 'Rich in nutrients'],
      featured: true,
      rating: 4.9,
      reviewCount: 89
    }
  ];
  
  res.json({
    success: true,
    data: products,
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    }
  });
});

// Get featured products
router.get('/featured', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Pure Coconut Oil',
      price: 25.00,
      volume: '500ml',
      images: ['/images/oil-bottle.png'],
      rating: 4.8
    },
    {
      id: 2,
      name: 'Virgin Coconut Oil',
      price: 45.00,
      volume: '1L',
      images: ['/images/oil-bottle.png'],
      rating: 4.9
    }
  ];
  
  res.json({
    success: true,
    data: products
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = {
    id: parseInt(req.params.id),
    name: 'Pure Coconut Oil',
    price: 25.00,
    volume: '500ml',
    category: 'Pure Coconut Oil',
    inStock: true,
    stockQuantity: 100,
    images: ['/images/oil-bottle.png'],
    description: '100% pure, natural coconut oil from Ghana. Perfect for cooking, skin care, and hair care.',
    shortDescription: 'Pure coconut oil for cooking and beauty',
    benefits: ['Natural', 'Healthy', 'Multipurpose', 'No additives', 'Cold-pressed'],
    ingredients: ['100% Coconut Oil'],
    usage: 'For cooking, skin care, hair care, and more',
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: product
  });
});

module.exports = router;
