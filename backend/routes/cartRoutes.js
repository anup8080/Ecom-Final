const express = require('express');
const { getCart, updateCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get current user’s cart
router.get('/', authMiddleware, getCart);

// Replace cart items and recalculate total
router.post('/', authMiddleware, updateCart);

module.exports = router;