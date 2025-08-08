const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Register a new user.  Accepts name, email, password, phone and
 * optional role.  Email addresses must be unique.  Passwords are
 * hashed using bcrypt before storage.  Responds with a JWT and
 * basic user information on success.
 */
exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: 'An account with that email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashed,
      role: role || 'customer',
      verified: false,
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id.toString(), name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.json({
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        verified: newUser.verified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};

/**
 * Authenticate a user by email/phone and password.  If valid, a JWT
 * and user details are returned.  The user’s lastLogin timestamp
 * is updated on success.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ $or: [{ email }, { phone: email }] }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to log in', error: err.message });
  }
};

/**
 * Log a user out.  With JWT stateless sessions this simply
 * returns success; tokens should be cleared client‑side.
 */
exports.logout = (req, res) => {
  return res.json({ message: 'Logged out successfully' });
};

/**
 * Check authentication status.  If `authMiddleware` succeeded the
 * user payload is attached to req.user and can be returned.
 */
exports.status = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({ authenticated: true, user: req.user });
};