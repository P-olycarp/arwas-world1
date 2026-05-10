const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arwas_world';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = 'OKATCHPOLYCARP@GMAIL.COM';
    const adminPassword = 'Polycarp254#';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Admin account updated successfully!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin WITHOUT pre-hashing the password
    // The User model will hash it in the pre('save') hook
    const admin = new User({
      firstName: 'Polycarp',
      lastName: 'Okatch',
      email: adminEmail,
      password: adminPassword, // Don't hash here!
      phone: '+254712345678',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nLogin at: http://localhost:5173/login');
    console.log('Access admin panel at: http://localhost:5173/admin');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
