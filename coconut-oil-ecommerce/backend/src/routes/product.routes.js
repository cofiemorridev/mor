const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/product.controller');
const { verifyJWT, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', verifyJWT, isAdmin, createProduct);
router.put('/:id', verifyJWT, isAdmin, updateProduct);
router.delete('/:id', verifyJWT, isAdmin, deleteProduct);

module.exports = router;
