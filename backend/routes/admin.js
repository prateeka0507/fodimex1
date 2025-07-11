const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Product, Order, OrderItem } = require('../models');

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const [userCount, productCount, totalSales, recentOrders] = await Promise.all([
      User.count(),
      Product.count(),
      Order.sum('total'),
      Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        attributes: ['id', 'total', 'status', 'createdAt']
      })
    ]);
    res.json({
      userCount,
      productCount,
      totalSales: totalSales || 0,
      recentOrders
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// List orders with filtering
router.get('/orders', auth, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { status, startDate, endDate, user } = req.query;
  const where = {};
  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[require('sequelize').Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[require('sequelize').Op.lte] = new Date(endDate);
  }
  if (user) {
    // Find user by email or id
    const userWhere = isNaN(user) ? { email: user } : { id: user };
    const foundUser = await User.findOne({ where: userWhere });
    if (foundUser) where.userId = foundUser.id;
    else return res.json([]); // No orders if user not found
  }
  try {
    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [{ model: Product }] }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router; 