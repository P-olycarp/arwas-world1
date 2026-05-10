const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Custom Printed T-Shirt',
    description: 'Premium quality custom printed t-shirt. Perfect for personal projects, corporate branding, or special events. Screen printed or DTG printing available.',
    price: 1499,
    basePrice: 1499,
    category: 't-shirt',
    image: 'https://picsum.photos/400/500?random=1',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#1A1A1A' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Red', code: '#FF6B6B' },
      { name: 'Teal', code: '#4ECDC4' }
    ],
    stock: 50,
    printingMethods: ['screen-print', 'dtg'],
    minOrderQuantity: 1,
    bulkDiscounts: [
      { quantity: 10, discountPercent: 10 },
      { quantity: 25, discountPercent: 15 },
      { quantity: 50, discountPercent: 20 }
    ],
    customizable: true
  },
  {
    name: 'Custom Printed Hoodie',
    description: 'Premium heavyweight hoodie with custom printing. Ideal for team uniforms, corporate branding, or personalized gifts. Screen printed or embroidered.',
    price: 2499,
    basePrice: 2499,
    category: 'hoodie',
    image: 'https://picsum.photos/400/500?random=2',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#1A1A1A' },
      { name: 'Dark Blue', code: '#2C3E50' },
      { name: 'Red', code: '#E74C3C' }
    ],
    stock: 30,
    printingMethods: ['screen-print', 'embroidery'],
    minOrderQuantity: 1,
    bulkDiscounts: [
      { quantity: 5, discountPercent: 8 },
      { quantity: 15, discountPercent: 12 },
      { quantity: 30, discountPercent: 18 }
    ],
    customizable: true
  },
  {
    name: 'Custom Printed Jersey',
    description: 'High-quality custom printed sports jersey. Perfect for teams, clubs, and corporate events. Breathable fabric with excellent print durability.',
    price: 1999,
    basePrice: 1999,
    category: 'jersey',
    image: 'https://picsum.photos/400/500?random=3',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#1A1A1A' },
      { name: 'Blue', code: '#3498DB' },
      { name: 'Gold', code: '#F39C12' }
    ],
    stock: 40,
    printingMethods: ['screen-print', 'dtg'],
    minOrderQuantity: 1,
    bulkDiscounts: [
      { quantity: 10, discountPercent: 12 },
      { quantity: 30, discountPercent: 18 },
      { quantity: 60, discountPercent: 25 }
    ],
    customizable: true
  },
  {
    name: 'Custom Printed Polo',
    description: 'Classic custom printed polo shirt. Ideal for corporate uniforms, corporate gifts, and professional branding. Premium fabric with embroidery options.',
    price: 1899,
    basePrice: 1899,
    category: 'polo',
    image: 'https://picsum.photos/400/500?random=4',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', code: '#1A1A1A' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Green', code: '#27AE60' }
    ],
    stock: 35,
    printingMethods: ['screen-print', 'embroidery'],
    minOrderQuantity: 1,
    bulkDiscounts: [
      { quantity: 10, discountPercent: 10 },
      { quantity: 25, discountPercent: 15 },
      { quantity: 50, discountPercent: 20 }
    ],
    customizable: true
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arwas_world');
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✓ Added ${insertedProducts.length} products`);

    insertedProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.category}) - KES ${product.price}`);
    });

    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedProducts();
