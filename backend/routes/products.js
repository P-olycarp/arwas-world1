const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Helper function to optimize product for API response
// Strips out massive base64 image data and keeps only file paths
const optimizeProduct = (product) => {
  const opt = product.toObject ? product.toObject() : product;
  
  // If image is a data URL, extract or replace with proper path
  if (opt.image && opt.image.startsWith('data:')) {
    // For base64 data URLs, we'll use a placeholder
    // In production, this data should have been stored as file paths
    opt.image = '/uploads/placeholder.jpg';
  } else if (opt.image && !opt.image.startsWith('/')) {
    // If image doesn't start with /, add /uploads prefix
    opt.image = `/uploads/${opt.image}`;
  }
  
  return opt;
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('-__v');
    // Optimize products to remove massive base64 data
    const optimized = products.map(optimizeProduct);
    res.json(optimized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category (case-insensitive, flexible match)
router.get('/category/:category', async (req, res) => {
  try {
    // Create a case-insensitive regex to match category
    const categoryRegex = new RegExp(`^${req.params.category.replace(/[-_ ]/g, '[ -_]?')}$`, 'i');
    const products = await Product.find({ category: { $regex: categoryRegex } }).select('-__v');
    // Optimize products to remove massive base64 data
    const optimized = products.map(optimizeProduct);
    res.json(optimized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const optimized = optimizeProduct(product);
    res.json(optimized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    const optimized = optimizeProduct(product);
    res.status(201).json(optimized);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const optimized = optimizeProduct(product);
    res.json(optimized);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
