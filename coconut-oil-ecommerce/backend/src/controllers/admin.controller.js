const Admin = require('../models/Admin.model');
const { generateToken } = require('../utils/generateToken');

/**
 * Check if database is available
 */
const checkDbAvailability = () => {
  try {
    // Check if Admin model is connected
    return Admin.db.readyState === 1;
  } catch (error) {
    return false;
  }
};

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check database availability
    const dbAvailable = checkDbAvailability();
    
    if (!dbAvailable) {
      // Demo mode - allow login with demo credentials
      if (email === 'admin@coconutoil.com' && password === 'Admin123!') {
        const token = generateToken({
          id: 'demo-admin-id',
          email: 'admin@coconutoil.com',
          role: 'super-admin',
          demo: true
        });

        return res.status(200).json({
          success: true,
          message: 'Demo login successful (database not available)',
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
      
      return res.status(503).json({
        success: false,
        message: 'Database not available. Using demo credentials: admin@coconutoil.com / Admin123!',
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

    // Generate token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    const adminData = admin.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: adminData
    });

  } catch (error) {
    console.error('Admin login error:', error);
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
    console.error('Get admin profile error:', error);
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

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: admin.toJSON()
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
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
  updateProfile
};
