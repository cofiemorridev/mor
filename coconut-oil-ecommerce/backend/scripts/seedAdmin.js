const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../src/models/Admin.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@coconutoil.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@coconutoil.com',
      password: hashedPassword,
      role: 'super-admin'
    });

    console.log('Admin created successfully:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();