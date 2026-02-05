const Admin = require('../models/Admin.model');
const { generateToken } = require('../utils/generateToken');
const logger = require('../utils/logger');

/**
 * Check if database is available
 */
const checkDbAvailability = () => {
  // Check if Admin model is connected (simplified check)
  return Admin.db.readyState === 1;
};

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    // Check database availability
    if (!checkDbAvailability()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.',
        demoMode: true
      });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // For demo purposes, allow login with demo credentials
    if (email === 'admin@coconutoil.com' && password === 'Admin123!') {
      // Generate token for demo user
      const token = generateToken({
        id: 'demo-admin-id',
        email: 'admin@coconutoil.com',
        role: 'super-admin',
        demo: true
      });

      logger.info('Demo admin logged in');

      return res.status(200).json({
        success: true,
        message: 'Demo login successful (using demo credentials)',
        token,
        admin: {
          id: 'demo-admin-id',
          name: 'Demo Admin',
          email: 'admin@coconutoil.com',
          role: 'super-admin',
          demo: true
        },
        demoMode: true
      });
    }

    // Real database login
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    // Prepare admin data for response
    const adminData = admin.toJSON();

    logger.info(`Admin logged in: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: adminData
    });

  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get admin profile
 * @route   GET /api/admin/profile
 * @access  Private (Admin)
 */
const getProfile = async (req, res) => {
  try {
    // Check database availability
    if (!checkDbAvailability()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available',
        demoMode: true
      });
    }

    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: admin.toJSON()
    });

  } catch (error) {
    logger.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update admin profile
 * @route   PUT /api/admin/profile
 * @access  Private (Admin)
 */
const updateProfile = async (req, res) => {
  try {
    // Check database availability
    if (!checkDbAvailability()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Profile updates disabled in demo mode.',
        demoMode: true
      });
    }

    const { name, email } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Check if email already exists (if changing email)
    if (email && email !== req.admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    logger.info(`Admin profile updated: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: admin.toJSON()
    });

  } catch (error) {
    logger.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/admin/change-password
 * @access  Private (Admin)
 */
const changePassword = async (req, res) => {
  try {
    // Check database availability
    if (!checkDbAvailability()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Password changes disabled in demo mode.',
        demoMode: true
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin.id).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    logger.info(`Admin password changed: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  changePassword
};
