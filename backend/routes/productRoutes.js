const express = require('express');
const multer = require('multer');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public product listing and details
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin/vendor endpoints for managing products
router.post('/', authMiddleware, requireRole('admin', 'vendor'), upload.array('images', 5), createProduct);
router.put('/:id', authMiddleware, requireRole('admin', 'vendor'), upload.array('images', 5), updateProduct);
router.delete('/:id', authMiddleware, requireRole('admin', 'vendor'), deleteProduct);

module.exports = router;