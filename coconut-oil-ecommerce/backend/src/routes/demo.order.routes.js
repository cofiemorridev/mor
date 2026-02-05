const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders
} = require('../controllers/demo.order.controller');

// Public routes
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Admin routes (no auth in demo mode)
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.get('/stats', getOrderStats);
router.get('/recent', getRecentOrders);

module.exports = router;
