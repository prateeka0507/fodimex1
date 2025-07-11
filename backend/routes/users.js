const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Update user info (name, email)
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    // Check if email is taken by another user
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    req.user.name = name;
    req.user.email = email;
    await req.user.save();
    res.json({ message: 'Profile updated', user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// List all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'Role updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 