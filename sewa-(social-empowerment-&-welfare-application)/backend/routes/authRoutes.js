
const express = require('express');
const router = express.Router();
const { User } = require('../models');

// In-Memory OTP Store
const otpStore = new Map();

// 1. Email/Password Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    
    const user = new User({ name, email, password, role, provider: 'LOCAL' });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password, provider: 'LOCAL' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Social OAuth Login/Signup
router.post('/oauth', async (req, res) => {
  try {
    const { provider, email, name, providerId, avatar } = req.body;
    
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { providerId: providerId, provider: provider }
      ]
    });

    if (user) {
      if (user.provider !== provider && !user.providerId) {
         user.provider = provider;
         user.providerId = providerId;
         await user.save();
      }
      return res.json(user);
    }

    user = new User({
      name,
      email,
      provider,
      providerId,
      avatar,
      role: 'CITIZEN'
    });
    await user.save();
    res.status(201).json(user);

  } catch (err) {
    console.error("OAuth Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 4. Phone OTP: Send Code
router.post('/otp/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone number required" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    otpStore.set(phoneNumber, { 
      code: otp, 
      expires: Date.now() + 5 * 60 * 1000 
    });

    console.log(`[SMS MOCK] OTP for ${phoneNumber} is: ${otp}`);
    res.json({ message: "OTP sent successfully", mockOtp: otp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Phone OTP: Verify Code
router.post('/otp/verify', async (req, res) => {
  try {
    const { phoneNumber, otp, name } = req.body;
    const storedData = otpStore.get(phoneNumber);

    if (!storedData) return res.status(400).json({ message: "OTP expired or not requested" });
    if (Date.now() > storedData.expires) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ message: "OTP expired" });
    }
    if (storedData.code !== otp) return res.status(400).json({ message: "Invalid OTP" });

    otpStore.delete(phoneNumber);

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({
        name: name || 'Mobile User',
        phoneNumber,
        provider: 'PHONE',
        role: 'CITIZEN'
      });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 6. Guest Login
router.post('/guest', async (req, res) => {
  try {
    const guestId = Date.now();
    const user = new User({
      name: `Guest ${guestId.toString().slice(-4)}`,
      email: `guest_${guestId}@sewa.local`,
      provider: 'GUEST',
      role: 'CITIZEN'
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Guest Login Error:", err);
    res.status(500).json({ message: "Guest login failed on server" });
  }
});

module.exports = router;
