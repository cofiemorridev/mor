const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');

/**
 * Verify JWT token
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'super-admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

/**
 * Check if user is super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'super-admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isSuperAdmin
};
