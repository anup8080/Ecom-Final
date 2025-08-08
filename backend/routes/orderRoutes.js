const express = require('express');
const { createOrder, getOrders, updateOrderStatus, getSalesSummary } = require('../controllers/orderController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get orders (user’s own or all if admin/vendor)
router.get('/', authMiddleware, getOrders);

// Update order status (admin/vendor only)
router.put('/:id', authMiddleware, requireRole('admin', 'vendor'), updateOrderStatus);

// Sales summary (admin/vendor only)
router.get('/admin/sales', authMiddleware, requireRole('admin', 'vendor'), getSalesSummary);

module.exports = router;