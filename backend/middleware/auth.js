const jwt = require('jsonwebtoken');

// Secret used to sign JWTs.  In a production environment this
// should be set in a .env file and not hard‑coded.
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Authenticate requests using a bearer token.  If a valid JWT is
 * provided in the Authorization header (e.g. `Bearer <token>`), the
 * decoded payload is attached to req.user and the request is allowed
 * to proceed.  Otherwise a 401 response is returned.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Require that the authenticated user have one of the specified roles.
 * Returns a middleware function that checks `req.user.role`.  If the
 * role does not match, a 403 response is returned.
 *
 * Example: router.post('/admin', authMiddleware, requireRole('admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
}

module.exports = { authMiddleware, requireRole };