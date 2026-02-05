const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price must be positive']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price must be positive']
  },
  volume: {
    type: String,
    required: [true, 'Please provide product volume'],
    enum: ['250ml', '500ml', '750ml', '1L', '2L', '5L'],
    default: '500ml'
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: [
      'Pure Coconut Oil',
      'Virgin Coconut Oil', 
      'Organic Coconut Oil',
      'Cold-Pressed Coconut Oil',
      'Fractionated Coconut Oil',
      'Coconut Oil Blend'
    ],
    default: 'Pure Coconut Oil'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  images: [{
    type: String,
    default: []
  }],
  benefits: [{
    type: String,
    default: []
  }],
  ingredients: [{
    type: String,
    default: []
  }],
  usage: {
    type: String,
    maxlength: [1000, 'Usage instructions cannot be more than 1000 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Add text index for search
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Format price to GHS
productSchema.methods.formatPrice = function() {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(this.price);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
