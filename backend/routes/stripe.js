const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const { Order, OrderItem, Product, User } = require('../models');

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { items, shippingInfo } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Fetch product details from DB to get price and name
    const line_items = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: shippingInfo?.email,
      success_url: `${req.headers.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
});

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { items, shippingInfo } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }
    // Fetch product details from DB to get price and name
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      total += product.price * item.quantity;
    }
    // Stripe expects amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(total) * 100),
      currency: 'inr',
      payment_method_types: ['card', 'upi', 'paytm', 'phonepe', 'google_pay'],
      metadata: {
        shippingInfo: JSON.stringify(shippingInfo),
        items: JSON.stringify(items)
      },
      receipt_email: shippingInfo?.email,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      // Retrieve metadata (cart, shippingInfo) from session
      const metadata = session.metadata ? JSON.parse(session.metadata.data) : null;
      if (!metadata) return res.status(400).send('No metadata found');
      const { userId, items, shippingAddress, shippingInfo } = metadata;
      // Calculate total and validate products
      let total = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) continue;
        total += product.price * item.quantity;
        await product.update({ stock: product.stock - item.quantity });
      }
      // Create order
      const order = await Order.create({
        userId,
        total,
        shippingAddress,
        shippingInfo
      });
      // Create order items
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) continue;
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      }
      console.log('Order created from Stripe webhook:', order.id);
    } catch (err) {
      console.error('Error creating order from Stripe webhook:', err);
      return res.status(500).send('Webhook order creation failed');
    }
  }
  res.json({ received: true });
});

module.exports = router; 