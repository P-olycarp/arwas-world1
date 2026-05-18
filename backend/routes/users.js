const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ================= REGISTER USER =================

router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      country
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        error: 'Please fill all required fields'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address: {
        country: country || 'Kenya'
      }
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        country: user.address?.country || ''
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      error: error.message || 'Registration failed'
    });
  }
});

// ================= LOGIN USER =================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(
      password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        country: user.address?.country || ''
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      error: error.message || 'Login failed'
    });
  }
});

// ================= GET USER PROFILE =================

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('GET USER ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ================= UPDATE USER =================

router.put('/:id', async (req, res) => {
  try {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);

    res.status(400).json({
      error: error.message
    });
  }
});

// ================= GET USER ORDERS =================

router.get('/:id/orders', async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).populate('orderHistory');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user.orderHistory || []);
  } catch (error) {
    console.error('GET USER ORDERS ERROR:', error);

    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
