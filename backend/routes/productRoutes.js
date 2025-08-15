const express = require('express');
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keeps original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});
// Configure multer for file uploads
const upload = multer({ storage });

const router = express.Router();

// Public product listing and details
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin/vendor endpoints for managing products
router.post('/', authMiddleware, requireRole('admin', 'vendor'), upload.array('images', 5), createProduct);
router.put('/:id', authMiddleware, requireRole('admin', 'vendor'), upload.array('images', 5), updateProduct);
router.delete('/:id', authMiddleware, requireRole('admin', 'vendor'), deleteProduct);

module.exports = router;