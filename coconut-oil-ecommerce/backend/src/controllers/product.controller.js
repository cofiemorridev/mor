const Product = require('../models/Product.model');
const { formatToGHS } = require('../utils/formatPrice');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      inStock,
      featured,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by stock status
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by text
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const productsPromise = Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain objects

    const totalPromise = Product.countDocuments(query);

    const [products, total] = await Promise.all([productsPromise, totalPromise]);

    // Format prices
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: formatToGHS(product.price),
      formattedComparePrice: product.comparePrice ? formatToGHS(product.comparePrice) : null,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0
    }));

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: Number(page),
      products: formattedProducts
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Format prices
    const formattedProduct = {
      ...product,
      formattedPrice: formatToGHS(product.price),
      formattedComparePrice: product.comparePrice ? formatToGHS(product.comparePrice) : null,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0
    };

    res.status(200).json({
      success: true,
      product: formattedProduct
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      volume,
      category,
      stockQuantity,
      benefits,
      ingredients,
      usage,
      featured
    } = req.body;

    // Create product
    const product = await Product.create({
      name,
      description,
      shortDescription: shortDescription || description.substring(0, 200),
      price,
      comparePrice: comparePrice || price,
      volume,
      category,
      stockQuantity: stockQuantity || 0,
      inStock: (stockQuantity || 0) > 0,
      benefits: benefits || [],
      ingredients: ingredients || [],
      usage,
      featured: featured || false,
      createdBy: req.admin?.id || null
    });

    // Format response
    const formattedProduct = {
      ...product.toObject(),
      formattedPrice: formatToGHS(product.price),
      formattedComparePrice: formatToGHS(product.comparePrice),
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0
    };

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: formattedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      volume,
      category,
      stockQuantity,
      inStock,
      benefits,
      ingredients,
      usage,
      featured
    } = req.body;

    // Find product
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (price !== undefined) updateData.price = price;
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice;
    if (volume !== undefined) updateData.volume = volume;
    if (category !== undefined) updateData.category = category;
    if (stockQuantity !== undefined) {
      updateData.stockQuantity = stockQuantity;
      updateData.inStock = stockQuantity > 0;
    }
    if (inStock !== undefined) updateData.inStock = inStock;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (usage !== undefined) updateData.usage = usage;
    if (featured !== undefined) updateData.featured = featured;

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    // Format response
    const formattedProduct = {
      ...product,
      formattedPrice: formatToGHS(product.price),
      formattedComparePrice: product.comparePrice ? formatToGHS(product.comparePrice) : null,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0
    };

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: formattedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .limit(8)
      .sort('-createdAt')
      .lean();

    // Format prices
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: formatToGHS(product.price),
      formattedComparePrice: product.comparePrice ? formatToGHS(product.comparePrice) : null,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      products: formattedProducts
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};
