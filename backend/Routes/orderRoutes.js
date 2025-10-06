


const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../Controllers/orderController');

// User routes
router.post('/', createOrder);
router.get('/user', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes (would need authentication middleware)
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
