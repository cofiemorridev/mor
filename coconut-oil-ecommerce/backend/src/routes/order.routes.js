const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/order.controller');
const { verifyJWT, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', createOrder);
router.get('/:id', getOrderById); // Can be accessed with order number
router.put('/:id/cancel', cancelOrder);

// Protected admin routes
router.get('/', verifyJWT, isAdmin, getAllOrders);
router.put('/:id/status', verifyJWT, isAdmin, updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus); // Used by webhook (no auth)
router.get('/stats/dashboard', verifyJWT, isAdmin, getOrderStats);

module.exports = router;
