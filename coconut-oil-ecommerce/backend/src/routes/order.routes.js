const express = require('express');
const router = express.Router();

// Create order
router.post('/', (req, res) => {
  const order = req.body;
  
  res.json({
    success: true,
    message: 'Order created successfully',
    data: {
      orderNumber: `CO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      ...order,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// Get order stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      counts: {
        total: 1248,
        pending: 12,
        today: 8,
        week: 45,
        month: 186
      },
      revenue: {
        total: 45231.50,
        average: 156.42
      }
    }
  });
});

// Get recent orders
router.get('/recent', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        orderNumber: 'CO-2024-0123',
        customerInfo: { 
          name: 'Kwame Asante', 
          email: 'kwame@example.com',
          phone: '+233241234567'
        },
        total: 110.00,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        orderNumber: 'CO-2024-0124',
        customerInfo: { 
          name: 'Ama Mensah', 
          email: 'ama@example.com',
          phone: '+233242345678'
        },
        total: 85.00,
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

// Get order by order number
router.get('/number/:orderNumber', (req, res) => {
  res.json({
    success: true,
    data: {
      orderNumber: req.params.orderNumber,
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+233241234567'
      },
      total: 110.00,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

module.exports = router;
