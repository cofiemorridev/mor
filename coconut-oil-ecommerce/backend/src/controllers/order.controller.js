const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const WhatsAppService = require('../services/whatsapp.service');
const EmailService = require('../services/email.service');

/**
 * Create a new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { customerInfo, shippingAddress, items, notes } = req.body;

    // Validate required fields
    if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone are required'
      });
    }

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.region) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is incomplete'
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate order totals and validate stock
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || null
      });
    }

    // Calculate delivery fee (simple logic - can be enhanced)
    const deliveryFee = shippingAddress.region.toLowerCase().includes('accra') ? 15 : 25;
    const total = subtotal + deliveryFee;

    // Generate order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-').pop()) : 0;
    const orderNumber = `CO-${new Date().getFullYear()}-${String(lastOrderNumber + 1).padStart(4, '0')}`;

    // Create order
    const order = new Order({
      orderNumber,
      customerInfo,
      shippingAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: req.body.paymentMethod || 'mobile_money',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes,
      paystackReference: req.body.paystackReference
    });

    // Save order
    const savedOrder = await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Send notifications
    try {
      // Send order confirmation to customer via email
      await EmailService.sendOrderConfirmation(savedOrder);

      // Send WhatsApp confirmation if number provided
      if (customerInfo.whatsappNumber || customerInfo.phone) {
        await WhatsAppService.sendOrderConfirmation(savedOrder);
      }

      // Send admin notifications
      await EmailService.sendAdminOrderNotification(savedOrder);
      await WhatsAppService.sendAdminNotification(savedOrder);

    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the order if notifications fail
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (admin only)
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { 
      status, 
      paymentStatus, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};

    // Apply filters
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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
 * Get order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get order by order number
 */
const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name images category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (admin only)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    
    // If order is cancelled and payment was made, consider refund logic
    if (status === 'cancelled' && order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    const updatedOrder = await order.save();

    // Send status update notifications
    try {
      await EmailService.sendOrderStatusUpdate(updatedOrder, oldStatus, status);
      await WhatsAppService.sendOrderStatusUpdate(updatedOrder, oldStatus, status);
    } catch (notificationError) {
      console.error('Status notification error:', notificationError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update payment status (called by Paystack webhook)
 */
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId, paymentStatus, paystackReference } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldPaymentStatus = order.paymentStatus;
    order.paymentStatus = paymentStatus;
    order.paystackReference = paystackReference || order.paystackReference;

    // If payment is successful, update order status to confirmed
    if (paymentStatus === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
    }

    const updatedOrder = await order.save();

    // Send payment confirmation if payment was successful
    if (paymentStatus === 'paid' && oldPaymentStatus !== 'paid') {
      try {
        await EmailService.sendPaymentConfirmation(updatedOrder);
        await WhatsAppService.sendPaymentConfirmation(updatedOrder);
      } catch (notificationError) {
        console.error('Payment notification error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order (admin only)
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled'
      });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = 'cancelled';
    order.notes = order.notes ? `${order.notes}\nCancelled: ${reason || 'No reason provided'}` : `Cancelled: ${reason || 'No reason provided'}`;

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: item.quantity } }
      );
    }

    const updatedOrder = await order.save();

    // Send cancellation notification
    try {
      await EmailService.sendOrderStatusUpdate(updatedOrder, oldStatus, 'cancelled');
      await WhatsAppService.sendOrderStatusUpdate(updatedOrder, oldStatus, 'cancelled');
    } catch (notificationError) {
      console.error('Cancellation notification error:', notificationError);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get order statistics for dashboard
 */
const getOrderStats = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const weekOrders = await Order.countDocuments({ createdAt: { $gte: weekAgo } });
    const monthOrders = await Order.countDocuments({ createdAt: { $gte: monthAgo } });

    // Revenue
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status distribution
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusDistribution = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        counts: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders,
          week: weekOrders,
          month: monthOrders
        },
        revenue: {
          total: totalRevenue,
          average: averageOrderValue
        },
        distribution: statusDistribution
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get recent orders for dashboard
 */
const getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('items.product', 'name images')
      .select('orderNumber customerInfo total orderStatus paymentStatus createdAt');

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  getRecentOrders
};
