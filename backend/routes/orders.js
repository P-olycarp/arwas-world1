const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendEmail } = require('../services/emailService');

// Create new order
router.post('/', async (req, res) => {
  try {
    // Generate unique order number
    const orderNumber = 'ORD-' + Date.now();
    
    const order = new Order({
      ...req.body,
      orderNumber
    });
    
    await order.save();
    
    // Send confirmation emails
    if (process.env.SENDGRID_API_KEY) {
      // Send to customer
      if (order.customerEmail) {
        await sendEmail('orderConfirmation', [order, order.customerEmail]);
      }
      
      // Send to admin
      if (process.env.ADMIN_EMAIL) {
        await sendEmail('adminNewOrder', { order });
      }
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by order number
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, internalNotes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        internalNotes,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Send status update email
    if (process.env.SENDGRID_API_KEY && order.customerEmail) {
      await sendEmail('orderStatusUpdate', [order, order.customerEmail]);
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Send status update email if status changed
    if (process.env.SENDGRID_API_KEY && order.customerEmail && req.body.status) {
      await sendEmail('orderStatusUpdate', [order, order.customerEmail]);
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Send cancellation status email
    if (process.env.SENDGRID_API_KEY && order.customerEmail) {
      await sendEmail('orderStatusUpdate', [order, order.customerEmail]);
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
