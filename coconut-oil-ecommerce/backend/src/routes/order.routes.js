const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  getRecentOrders
} = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', createOrder);
router.get('/stats', getOrderStats); // For dashboard, but returns basic stats
router.get('/recent', getRecentOrders); // For dashboard
router.get('/number/:orderNumber', getOrderByNumber);

// Admin routes (protected)
router.get('/', verifyToken, isAdmin, getAllOrders);
router.get('/:id', verifyToken, isAdmin, getOrderById);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus); // Used by Paystack webhook (no auth required for webhook)
router.put('/:id/cancel', verifyToken, isAdmin, cancelOrder);

module.exports = router;
