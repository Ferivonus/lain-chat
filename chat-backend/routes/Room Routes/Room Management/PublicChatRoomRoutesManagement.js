const express = require('express');
const router = express.Router();
const Room = require('../../../models/ChatRooms/PublicChatRoom');

// Yeni bir genel oda oluştur
router.post('/create', async (req, res) => {
  const { name, creator_username } = req.body;

  if (!name || !creator_username) {
    return res.status(400).send({ error: 'Oda adı ve yaratıcı adı gerekli.' });
  }

  try {
    const newRoom = new Room({ name, creator_username });
    await newRoom.save();
    res.status(201).send({ message: 'Oda başarıyla oluşturuldu.', data: newRoom });
  } catch (error) {
    console.error('Oda oluşturulurken hata:', error);
    res.status(500).send({ error: 'Oda oluşturulurken bir hata oluştu.' });
  }
});

// Tüm genel odaları getir
router.get('/all', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).send({ message: 'Odalar başarıyla getirildi.', data: rooms });
  } catch (error) {
    console.error('Odalar alınırken hata:', error);
    res.status(500).send({ error: 'Odalar alınırken bir hata oluştu.' });
  }
});

module.exports = router;