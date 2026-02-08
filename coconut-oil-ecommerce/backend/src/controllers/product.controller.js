const Product = require('../models/Product.model');
const WhatsAppService = require('../services/whatsapp.service');
const EmailService = require('../services/email.service');

/**
 * Create new product (admin only)
 */
const createProduct = async (req, res, next) => {
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

    // Handle image upload
    const images = req.files ? req.files.map(file => 
      `/uploads/${file.filename}`
    ) : [];

    const product = new Product({
      name,
      description,
      shortDescription,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      volume,
      category,
      stockQuantity: parseInt(stockQuantity) || 0,
      inStock: parseInt(stockQuantity) > 0,
      images,
      benefits: benefits ? benefits.split(',').map(b => b.trim()) : [],
      ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
      usage,
      featured: featured === 'true',
      createdBy: req.admin?._id
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      featured, 
      minPrice, 
      maxPrice, 
      inStock, 
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (inStock === 'true') {
      query.inStock = true;
    } else if (inStock === 'false') {
      query.inStock = false;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update product (admin only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle stock quantity changes
    if (updateData.stockQuantity !== undefined) {
      const oldStock = existingProduct.stockQuantity;
      const newStock = parseInt(updateData.stockQuantity);
      
      // Check for low stock alert
      if (oldStock > 5 && newStock <= 5) {
        try {
          await EmailService.sendLowStockAlert(existingProduct, newStock);
          await WhatsAppService.sendLowStockAlert(existingProduct, newStock);
        } catch (notificationError) {
          console.error('Low stock notification error:', notificationError);
        }
      }
      
      // Update inStock status
      updateData.inStock = newStock > 0;
    }

    // Handle price conversions
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    
    if (updateData.comparePrice) {
      updateData.comparePrice = parseFloat(updateData.comparePrice);
    }

    // Handle image upload (if any)
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => 
        `/uploads/${file.filename}`
      );
      updateData.images = imageUrls;
    }

    // Handle array fields
    if (updateData.benefits && typeof updateData.benefits === 'string') {
      updateData.benefits = updateData.benefits.split(',').map(b => b.trim());
    }
    
    if (updateData.ingredients && typeof updateData.ingredients === 'string') {
      updateData.ingredients = updateData.ingredients.split(',').map(i => i.trim());
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .sort('-createdAt')
      .limit(8);

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Search products
 */
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts
};
