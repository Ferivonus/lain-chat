const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Kayıt API
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Kullanıcı adı ve parola gereklidir');
    }

    console.log('Received password:', password); 

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Kullanıcı zaten mevcut');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword); 

    const newUser = new User({ username: username, password: hashedPassword });

    await newUser.save();

    res.status(201).send('Kullanıcı başarıyla kaydedildi');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Kullanıcı adı ve parola gereklidir');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Kullanıcı bulunamadı');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Parola yanlış');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
  }
});

module.exports = router;
