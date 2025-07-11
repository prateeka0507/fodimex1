const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { ContactMessage } = require('../models');

// Configure Nodemailer (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    // Save to DB
    const saved = await ContactMessage.create({ name, email, message });
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'prateekakathiresan@gmail.com',
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router; 