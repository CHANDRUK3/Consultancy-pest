// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/create-admin (for initial setup - run once)
router.post('/create-admin', async (req, res) => {
  try {
    console.log('[DEBUG] create-admin route hit');

    // Check if admin already exists
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('[DEBUG] Admin already exists');
      return res.status(200).json({ 
        message: 'Admin user already exists',
        username: 'admin'
      });
    }

    console.log('[DEBUG] Creating new admin user...');

    const user = new User({
      username: 'admin',
      password: 'admin123',           // will be auto-hashed by pre-save hook
      role: 'admin'
    });

    await user.save();
    console.log('[DEBUG] Admin user saved successfully');

    res.status(201).json({ 
      message: 'Admin user created successfully',
      username: 'admin',
      note: 'Password: admin123 (change it immediately after first login)'
    });
  } catch (err) {
    console.error('[ERROR] create-admin failed:', err.message);
    console.error('[ERROR] Full stack:', err.stack);

    res.status(500).json({ 
      message: 'Failed to create admin user',
      error: err.message,
      hint: 'Check MongoDB connection, model import, and bcrypt'
    });
  }
});

// POST /api/auth/login (real login for frontend)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('[DEBUG] login attempt for:', username);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('[DEBUG] Login successful for:', username);
    res.json({ 
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('[ERROR] login failed:', err.message);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;