const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const stripeRoutes = require('./routes/stripe');
const userRoutes = require('./routes/users');
const wishlistRoutes = require('./routes/wishlist');
const contactRoute = require('./routes/contact');

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoute);

// Health check
app.get('/', (req, res) => res.send('API Running'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 