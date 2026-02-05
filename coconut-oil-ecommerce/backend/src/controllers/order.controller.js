const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { formatToGHS, calculateDeliveryFee, calculateOrderTotal } = require('../utils/formatPrice');
const { sendOrderConfirmation, sendAdminNotification } = require('../services/email.service');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer information (name, email, phone)'
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.region) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one item to the order'
      });
    }

    // Validate and process items
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a product ID and quantity of at least 1'
        });
      }

      // In demo mode, use mock product data
      const product = {
        _id: item.product,
        name: item.name || 'Demo Product',
        price: item.price || 0,
        images: item.image ? [item.image] : []
      };

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || ''
      });
    }

    // Calculate delivery fee based on region
    const deliveryFee = calculateDeliveryFee(shippingAddress.region);
    
    // Calculate totals
    const totals = calculateOrderTotal(processedItems, deliveryFee);

    // Create order
    const order = await Order.create({
      customerInfo,
      shippingAddress,
      items: processedItems,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      paymentMethod: paymentMethod || 'mobile_money',
      notes: notes || ''
    });

    // Format order for response
    const formattedOrder = {
      ...order.toObject(),
      formattedSubtotal: formatToGHS(order.subtotal),
      formattedDeliveryFee: formatToGHS(order.deliveryFee),
      formattedTotal: formatToGHS(order.total),
      formattedDate: order.formattedDate,
      estimatedDeliveryDate: order.estimatedDeliveryDate
    };

    // Send notifications (in demo mode, just log)
    console.log(`📦 New order created: ${order.orderNumber}`);
    console.log(`   Customer: ${customerInfo.name}`);
    console.log(`   Total: ${formatToGHS(order.total)}`);
    console.log(`   Items: ${items.length} item(s)`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: formattedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle duplicate order number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists. Please try again.'
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
 * @desc    Get all orders (admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = {};

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search by order number, customer name, email, or phone
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const ordersPromise = Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPromise = Order.countDocuments(query);

    const [orders, total] = await Promise.all([ordersPromise, totalPromise]);

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      ...order,
      formattedSubtotal: formatToGHS(order.subtotal),
      formattedDeliveryFee: formatToGHS(order.deliveryFee),
      formattedTotal: formatToGHS(order.total),
      formattedDate: new Date(order.createdAt).toLocaleDateString('en-GH'),
      itemCount: order.items.length
    }));

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages,
      currentPage: Number(page),
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get order by ID or order number
 * @route   GET /api/orders/:id
 * @access  Public (with order number) / Private (admin)
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's an order number (format: CO-YYYYMMDD-XXXX)
    const isOrderNumber = /^CO-\d{8}-\d{4}$/.test(id);

    let query;
    if (isOrderNumber) {
      query = { orderNumber: id };
    } else {
      query = { _id: id };
    }

    const order = await Order.findOne(query)
      .populate('items.product', 'name images category')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Format order for response
    const formattedOrder = {
      ...order,
      formattedSubtotal: formatToGHS(order.subtotal),
      formattedDeliveryFee: formatToGHS(order.deliveryFee),
      formattedTotal: formatToGHS(order.total),
      formattedDate: new Date(order.createdAt).toLocaleDateString('en-GH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: order.items.map(item => ({
        ...item,
        formattedPrice: formatToGHS(item.price),
        itemTotal: formatToGHS(item.price * item.quantity)
      })),
      canBeCancelled: new Date(order.createdAt) > new Date(Date.now() - 60 * 60 * 1000) && order.orderStatus === 'pending'
    };

    res.status(200).json({
      success: true,
      order: formattedOrder
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order status'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    order.orderStatus = status;
    
    // Update timestamps for specific statuses
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      // Restore stock if order is cancelled
      await order.updateProductStock('increase');
    }

    if (notes) {
      order.notes = notes;
    }

    await order.save();

    // Format response
    const formattedOrder = {
      ...order.toObject(),
      formattedSubtotal: formatToGHS(order.subtotal),
      formattedDeliveryFee: formatToGHS(order.deliveryFee),
      formattedTotal: formatToGHS(order.total),
      formattedDate: order.formattedDate
    };

    // Log status update
    console.log(`📦 Order ${order.orderNumber} status updated to: ${status}`);
    if (order.customerInfo.email) {
      console.log(`   Notification would be sent to: ${order.customerInfo.email}`);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: formattedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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
 * @desc    Update payment status
 * @route   PUT /api/orders/:id/payment
 * @access  Private (Paystack webhook)
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paystackReference, isPaid } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment info
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    if (paystackReference) {
      order.paystackReference = paystackReference;
    }
    
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = new Date();
        order.paymentStatus = 'paid';
        
        // Update stock when payment is confirmed
        await order.updateProductStock('decrease');
        
        // Update order status to confirmed
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed';
        }
      }
    }

    await order.save();

    // Log payment update
    console.log(`💰 Order ${order.orderNumber} payment status: ${order.paymentStatus}`);
    console.log(`   Paid: ${order.isPaid ? 'Yes' : 'No'}`);
    console.log(`   Reference: ${order.paystackReference || 'N/A'}`);

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        isPaid: order.isPaid,
        orderStatus: order.orderStatus
      }
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Public (with order number) / Private (admin)
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled. Only pending orders within 1 hour of creation can be cancelled.'
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    
    // Restore stock
    await order.updateProductStock('increase');
    
    await order.save();

    console.log(`❌ Order ${order.orderNumber} cancelled by ${req.admin ? 'admin' : 'customer'}`);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get order statistics (admin only)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = async (req, res) => {
  try {
    // For demo mode, return mock stats
    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      averageOrderValue: 0,
      monthlyRevenue: [],
      orderStatusDistribution: {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      },
      paymentStatusDistribution: {
        pending: 0,
        paid: 0,
        failed: 0,
        refunded: 0
      },
      topRegions: []
    };

    // Format currency
    const formattedStats = {
      ...stats,
      formattedTotalRevenue: formatToGHS(stats.totalRevenue),
      formattedAverageOrderValue: formatToGHS(stats.averageOrderValue),
      formattedMonthlyRevenue: stats.monthlyRevenue.map(item => ({
        ...item,
        revenue: formatToGHS(item.revenue)
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Order statistics (demo mode)',
      stats: formattedStats,
      demoMode: true
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
};
