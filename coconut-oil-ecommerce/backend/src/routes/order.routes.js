const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  getRecentOrders
} = require('../controllers/order.controller');
const { verifyJWT, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Admin routes (protected)
router.get('/', verifyJWT, isAdmin, getAllOrders);
router.put('/:id/status', verifyJWT, isAdmin, updateOrderStatus);
router.put('/:id/payment', verifyJWT, isAdmin, updatePaymentStatus);
router.put('/:id/cancel', verifyJWT, isAdmin, cancelOrder);
router.get('/stats', verifyJWT, isAdmin, getOrderStats);
router.get('/recent', verifyJWT, isAdmin, getRecentOrders);

module.exports = router;
