const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Wishlist, Product } = require('../models');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [Product],
      order: [['createdAt', 'DESC']]
    });
    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to wishlist
router.post('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    // Prevent duplicates
    const existing = await Wishlist.findOne({ where: { userId: req.user.id, productId } });
    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    const item = await Wishlist.create({ userId: req.user.id, productId });
    res.status(201).json(item);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove product from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const item = await Wishlist.findOne({ where: { userId: req.user.id, productId } });
    if (!item) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }
    await item.destroy();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 