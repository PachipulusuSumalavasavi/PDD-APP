const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careermate_super_secret_jwt_key_2026');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback for mock users when DB is bypassed or token contains basic mock payload
        req.user = { id: decoded.id, role: decoded.role, email: decoded.email, name: decoded.name || 'User' };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
