const express = require('express');
const { register, login, logout, status } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public endpoints for registration and login
router.post('/register', register);
router.post('/login', login);

// Logout simply returns success and is protected by auth middleware
router.post('/logout', authMiddleware, logout);

// Check authentication status.  Requires a valid token
router.get('/status', authMiddleware, status);

module.exports = router;