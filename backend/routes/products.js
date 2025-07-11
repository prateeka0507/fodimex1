const express = require('express');
const { Product, Review, User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products with search and filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (search) {
      where.name = { [require('sequelize').Op.iLike]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * limit;
    
    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products: products.rows,
      total: products.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(products.count / limit)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, price, image, category, stock } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update({ name, description, price, image, category, stock });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review to a product (one per user per product)
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }
    // Prevent multiple reviews per user per product
    const existing = await Review.findOne({ where: { productId: req.params.id, userId: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    const review = await Review.create({
      productId: req.params.id,
      userId: req.user.id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 