const Order = require('../models/Order.model');

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || !subtotal || !total) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required order information'
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Create order
    const orderData = {
      customerInfo,
      shippingAddress,
      items,
      subtotal: parseFloat(subtotal),
      deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
      total: parseFloat(total),
      paymentMethod: paymentMethod || 'mobile_money',
      notes: notes || ''
    };

    // Calculate delivery fee if not provided
    if (!deliveryFee) {
      // Simple delivery fee calculation based on region
      const region = shippingAddress.region;
      const regionDeliveryFees = {
        'Greater Accra': 15.00,
        'Ashanti': 25.00,
        'Western': 30.00,
        'Central': 20.00,
        'Volta': 25.00,
        'Eastern': 22.00,
        'Northern': 40.00,
        'Upper East': 45.00,
        'Upper West': 45.00,
        'Brong-Ahafo': 35.00
      };
      
      orderData.deliveryFee = regionDeliveryFees[region] || 25.00;
      orderData.total = orderData.subtotal + orderData.deliveryFee;
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'Order number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/orders
 * @access  Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentStatus,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    
    // Add filters
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

/**
 * @desc    Get order by ID or order number
 * @route   GET /api/orders/:id
 * @access  Public (with order number)
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    
    // Try to find by order number first
    if (id.startsWith('CO-')) {
      order = await Order.findOne({ orderNumber: id }).lean();
    } else {
      // Try to find by MongoDB ID
      order = await Order.findById(id).lean();
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.orderStatus = status;
    
    // If delivered, set delivery date
    if (status === 'delivered' && !order.deliveryDate) {
      order.deliveryDate = new Date();
    }
    
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

/**
 * @desc    Update payment status (for webhooks/internal use)
 * @route   PUT /api/orders/:id/payment
 * @access  Internal
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paystackReference } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;
    if (paystackReference) {
      order.paystackReference = paystackReference;
    }
    
    // If payment is successful, mark order as confirmed
    if (paymentStatus === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
    }
    
    await order.save();

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: order
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
};

/**
 * @desc    Cancel order (admin only)
 * @route   PUT /api/orders/:id/cancel
 * @access  Admin
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.notes = order.notes ? `${order.notes}\nCancelled: ${reason || 'No reason provided'}` : 
                               `Cancelled: ${reason || 'No reason provided'}`;
    
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};

/**
 * @desc    Get order statistics for dashboard
 * @route   GET /api/orders/stats
 * @access  Admin
 */
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalOrders,
      todayOrders,
      thisMonthOrders,
      thisYearOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      todayRevenue,
      averageOrderValue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfYear } }),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfToday },
            orderStatus: { $ne: 'cancelled' },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
        { $group: { _id: null, average: { $avg: '$total' } } }
      ])
    ]);

    const stats = {
      counts: {
        total: totalOrders,
        today: todayOrders,
        thisMonth: thisMonthOrders,
        thisYear: thisYearOrders,
        pending: pendingOrders,
        delivered: deliveredOrders
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0,
        average: averageOrderValue[0]?.average || 0
      },
      percentageChange: {
        daily: todayOrders > 0 ? ((todayOrders / totalOrders) * 100).toFixed(1) : 0,
        monthly: thisMonthOrders > 0 ? ((thisMonthOrders / totalOrders) * 100).toFixed(1) : 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
};

/**
 * @desc    Get recent orders (for admin dashboard)
 * @route   GET /api/orders/recent
 * @access  Admin
 */
const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('orderNumber customerInfo.name total orderStatus paymentStatus createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: recentOrders.length,
      data: recentOrders
    });

  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent orders'
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
  getOrderStats,
  getRecentOrders
};
