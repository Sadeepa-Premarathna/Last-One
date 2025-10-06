const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getExpiringProducts,
  getLowStockProducts,
  getDashboardStats
} = require('../controllers/inventoryController');

const router = express.Router();

// Dashboard stats
router.get('/stats', getDashboardStats);

// Expiring products
router.get('/expiring', getExpiringProducts);

// Low stock products
router.get('/low-stock', getLowStockProducts);

// CRUD operations
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;