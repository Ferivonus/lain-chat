const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Kayıt API
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).send('Kullanıcı adı ve parola gereklidir');
    }

    console.log('Received password:', password); // Debugging line

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Kullanıcı zaten mevcut');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword); // Debugging line

    // Create new user
    const newUser = new User({ username: username, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).send('Kullanıcı başarıyla kaydedildi');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
  }
});

// Giriş API
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).send('Kullanıcı adı ve parola gereklidir');
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Kullanıcı bulunamadı');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Parola yanlış');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
  }
});

module.exports = router;
