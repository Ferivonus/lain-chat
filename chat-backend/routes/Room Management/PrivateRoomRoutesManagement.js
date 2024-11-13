const express = require('express');
const router = express.Router();
const PrivateRoom = require('../../models/ChatRooms/PrivateChatRoom');

// Yeni özel oda oluştur
router.post('/create', async (req, res) => {
  const { name, creator_username, invited_users } = req.body;

  if (!name || !creator_username) {
    return res.status(400).send({ error: 'Oda adı ve yaratıcı adı gerekli.' });
  }

  try {
    const newPrivateRoom = new PrivateRoom({ name, creator_username, invited_users });
    await newPrivateRoom.save();
    res.status(201).send({ message: 'Özel oda başarıyla oluşturuldu.', data: newPrivateRoom });
  } catch (error) {
    console.error('Özel oda oluşturulurken hata:', error);
    res.status(500).send({ error: 'Özel oda oluşturulurken bir hata oluştu.' });
  }
});

// Tüm özel odaları getir
router.get('/all', async (req, res) => {
  try {
    const privateRooms = await PrivateRoom.find();
    res.status(200).send({ message: 'Özel odalar başarıyla getirildi.', data: privateRooms });
  } catch (error) {
    console.error('Özel odalar alınırken hata:', error);
    res.status(500).send({ error: 'Özel odalar alınırken bir hata oluştu.' });
  }
});

module.exports = router;
