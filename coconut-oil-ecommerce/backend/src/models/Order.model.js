const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  image: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide customer email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide customer phone number'],
      trim: true
    },
    whatsappNumber: {
      type: String,
      trim: true
    }
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Please provide street address'],
      trim: true,
      maxlength: [200, 'Street address cannot be more than 200 characters']
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      maxlength: [100, 'City cannot be more than 100 characters']
    },
    region: {
      type: String,
      required: [true, 'Please provide region'],
      enum: [
        'Greater Accra',
        'Ashanti',
        'Western',
        'Central',
        'Eastern',
        'Volta',
        'Northern',
        'Upper East',
        'Upper West',
        'Brong Ahafo'
      ],
      default: 'Greater Accra'
    },
    country: {
      type: String,
      default: 'Ghana'
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal must be positive']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total must be positive']
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'card', 'bank_transfer'],
    default: 'mobile_money'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paystackReference: {
    type: String,
    trim: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Find the latest order for today
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const lastOrder = await this.constructor.findOne({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSeq = parseInt(lastOrder.orderNumber.split('-').pop());
      if (!isNaN(lastSeq)) {
        sequence = lastSeq + 1;
      }
    }
    
    this.orderNumber = `CO-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for estimated delivery date (3-5 business days)
orderSchema.virtual('estimatedDeliveryDate').get(function() {
  const deliveryDate = new Date(this.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days for Ghana
  return deliveryDate.toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to update stock quantities
orderSchema.methods.updateProductStock = async function(action = 'decrease') {
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      if (action === 'decrease') {
        product.stockQuantity -= item.quantity;
      } else if (action === 'increase') {
        product.stockQuantity += item.quantity;
      }
      
      product.inStock = product.stockQuantity > 0;
      await product.save();
    }
  }
};

// Method to check if order can be cancelled (within 1 hour)
orderSchema.methods.canBeCancelled = function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.createdAt > oneHourAgo && this.orderStatus === 'pending';
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
