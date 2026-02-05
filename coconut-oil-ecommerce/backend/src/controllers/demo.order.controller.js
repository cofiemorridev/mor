/**
 * Demo order controller for testing without database
 */
let demoOrders = [
  {
    _id: 'demo1',
    orderNumber: 'CO-2024-0001',
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0241234567',
      whatsappNumber: '0241234567'
    },
    shippingAddress: {
      street: '123 Main Street',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      zipCode: 'GA123'
    },
    items: [
      {
        product: 'demo1',
        name: 'Pure Coconut Oil',
        price: 25.00,
        quantity: 2,
        image: '/images/oil-bottle.png'
      }
    ],
    subtotal: 50.00,
    deliveryFee: 15.00,
    total: 65.00,
    paymentMethod: 'mobile_money',
    paymentStatus: 'paid',
    paystackReference: 'PS_demo_001',
    orderStatus: 'confirmed',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    _id: 'demo2',
    orderNumber: 'CO-2024-0002',
    customerInfo: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0279876543',
      whatsappNumber: '0279876543'
    },
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Kumasi',
      region: 'Ashanti',
      country: 'Ghana',
      zipCode: 'KA456'
    },
    items: [
      {
        product: 'demo2',
        name: 'Virgin Coconut Oil',
        price: 35.00,
        quantity: 1,
        image: '/images/oil-bottle.png'
      },
      {
        product: 'demo3',
        name: 'Organic Coconut Oil',
        price: 40.00,
        quantity: 1,
        image: '/images/oil-bottle.png'
      }
    ],
    subtotal: 75.00,
    deliveryFee: 25.00,
    total: 100.00,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paystackReference: 'PS_demo_002',
    orderStatus: 'delivered',
    deliveryDate: new Date('2024-01-20T14:00:00Z'),
    createdAt: new Date('2024-01-10T14:45:00Z'),
    updatedAt: new Date('2024-01-20T14:00:00Z')
  },
  {
    _id: 'demo3',
    orderNumber: 'CO-2024-0003',
    customerInfo: {
      name: 'Kwame Boateng',
      email: 'kwame@example.com',
      phone: '0205551234',
      whatsappNumber: '0205551234'
    },
    shippingAddress: {
      street: '789 Palm Street',
      city: 'Cape Coast',
      region: 'Central',
      country: 'Ghana',
      zipCode: 'CC789'
    },
    items: [
      {
        product: 'demo1',
        name: 'Pure Coconut Oil',
        price: 25.00,
        quantity: 3,
        image: '/images/oil-bottle.png'
      }
    ],
    subtotal: 75.00,
    deliveryFee: 20.00,
    total: 95.00,
    paymentMethod: 'mobile_money',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    createdAt: new Date('2024-01-25T09:15:00Z'),
    updatedAt: new Date('2024-01-25T09:15:00Z')
  }
];

let nextOrderNumber = 4;

const generateOrderNumber = () => {
  const number = `CO-2024-${String(nextOrderNumber).padStart(4, '0')}`;
  nextOrderNumber++;
  return number;
};

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

    // Create new order
    const newOrder = {
      _id: `demo${demoOrders.length + 1}`,
      orderNumber: generateOrderNumber(),
      customerInfo,
      shippingAddress,
      items: items.map(item => ({
        ...item,
        product: item.product || 'demo1'
      })),
      subtotal: parseFloat(subtotal),
      deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 15.00,
      total: parseFloat(total),
      paymentMethod: paymentMethod || 'mobile_money',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    demoOrders.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully (demo mode)',
      data: newOrder,
      orderNumber: newOrder.orderNumber,
      demo: true
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      status,
      paymentStatus 
    } = req.query;

    let filteredOrders = [...demoOrders];

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.orderStatus === status);
    }
    
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedOrders.length,
      total: filteredOrders.length,
      page: parseInt(page),
      pages: Math.ceil(filteredOrders.length / parseInt(limit)),
      data: paginatedOrders,
      demo: true
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    
    // Try to find by order number first
    if (id.startsWith('CO-')) {
      order = demoOrders.find(o => o.orderNumber === id);
    } else {
      // Try to find by ID
      order = demoOrders.find(o => o._id === id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      demo: true
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

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

    const orderIndex = demoOrders.findIndex(o => o._id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    demoOrders[orderIndex].orderStatus = status;
    demoOrders[orderIndex].updatedAt = new Date();
    
    if (status === 'delivered' && !demoOrders[orderIndex].deliveryDate) {
      demoOrders[orderIndex].deliveryDate = new Date();
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status} (demo mode)`,
      data: demoOrders[orderIndex],
      demo: true
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const stats = {
      counts: {
        total: demoOrders.length,
        today: demoOrders.filter(o => {
          const today = new Date();
          const orderDate = new Date(o.createdAt);
          return orderDate.toDateString() === today.toDateString();
        }).length,
        thisMonth: demoOrders.filter(o => {
          const now = new Date();
          const orderDate = new Date(o.createdAt);
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        }).length,
        thisYear: demoOrders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate.getFullYear() === 2024;
        }).length,
        pending: demoOrders.filter(o => o.orderStatus === 'pending').length,
        delivered: demoOrders.filter(o => o.orderStatus === 'delivered').length
      },
      revenue: {
        total: demoOrders
          .filter(o => o.orderStatus !== 'cancelled' && o.paymentStatus === 'paid')
          .reduce((sum, order) => sum + order.total, 0),
        today: demoOrders
          .filter(o => {
            const today = new Date();
            const orderDate = new Date(o.createdAt);
            return orderDate.toDateString() === today.toDateString() &&
                   o.orderStatus !== 'cancelled' && o.paymentStatus === 'paid';
          })
          .reduce((sum, order) => sum + order.total, 0),
        average: demoOrders.length > 0 ? 
          demoOrders.reduce((sum, order) => sum + order.total, 0) / demoOrders.length : 0
      },
      percentageChange: {
        daily: '12.5',
        monthly: '28.3'
      }
    };

    res.status(200).json({
      success: true,
      data: stats,
      demo: true
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentOrders = [...demoOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit))
      .map(order => ({
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }));

    res.status(200).json({
      success: true,
      count: recentOrders.length,
      data: recentOrders,
      demo: true
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
  getOrderStats,
  getRecentOrders
};
