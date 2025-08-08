const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

// Seed the database with sample users and products.  This script
// connects to MongoDB using the configured MONGO_URI and populates
// the collections with a few entries.  Existing data is cleared
// before seeding.  To run this script execute `node seed.js` from
// the backend directory.

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding');

    // Remove existing documents
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create sample users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    const customerPassword = await bcrypt.hash('user123', 10);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@momo.com',
      phone: '9800000000',
      password: adminPassword,
      role: 'admin',
      verified: true,
    });

    const vendor = new User({
      name: 'Vendor User',
      email: 'vendor@momo.com',
      phone: '9811111111',
      password: vendorPassword,
      role: 'vendor',
      verified: true,
    });

    const customer = new User({
      name: 'Test Customer',
      email: 'user@momo.com',
      phone: '9822222222',
      password: customerPassword,
      role: 'customer',
      verified: true,
    });

    await admin.save();
    await vendor.save();
    await customer.save();

    console.log('Sample users created');

    // Create sample products
    const vegMomo = new Product({
      name: 'Veg Momo',
      description: 'Classic steamed momos stuffed with mixed vegetables.',
      price: 120,
      category: 'Veg',
      brand: 'Momo House',
      sku: 'VEG-001',
      stock: 50,
      variations: ['Spicy', 'Non-Spicy'],
      tags: ['veg', 'steamed'],
      isFeatured: true,
      images: ['/uploads/veg-momo.jpg'],
    });

    const buffMomo = new Product({
      name: 'Buff Momo',
      description: 'Juicy buffalo meat momos served with spicy achar.',
      price: 150,
      category: 'Buff',
      brand: 'Momo House',
      sku: 'BUFF-001',
      stock: 40,
      variations: ['Spicy', 'Non-Spicy'],
      tags: ['buff', 'steamed'],
      images: ['/uploads/buff-momo.jpg'],
    });

    const cheeseMomo = new Product({
      name: 'Cheese Momo',
      description: 'Soft momos stuffed with melty cheese.',
      price: 180,
      category: 'Cheese',
      brand: 'Momo House',
      sku: 'CHEESE-001',
      stock: 30,
      variations: ['Regular', 'Extra Cheese'],
      tags: ['cheese', 'steamed'],
      images: ['/uploads/cheese-momo.jpg'],
    });

    await vegMomo.save();
    await buffMomo.save();
    await cheeseMomo.save();

    console.log('Sample products created');
    console.log('Database seeding completed');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();