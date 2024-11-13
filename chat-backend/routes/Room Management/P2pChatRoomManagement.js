const express = require('express');
const router = express.Router();
const PrivateChatRoom = require('../../models/ChatRooms/p2pChatRoom');

// Yeni birebir konuşma odası oluştur
router.post('/create', async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).send({ error: 'Her iki kullanıcı adı da gerekli.' });
  }

  try {
    const newChatRoom = new PrivateChatRoom({ user1, user2 });
    await newChatRoom.save();
    res.status(201).send({ message: 'Birebir konuşma odası başarıyla oluşturuldu.', data: newChatRoom });
  } catch (error) {
    console.error('Birebir konuşma odası oluşturulurken hata:', error);
    res.status(500).send({ error: 'Birebir konuşma odası oluşturulurken bir hata oluştu.' });
  }
});

// İki kullanıcı arasındaki özel odaları bul
router.get('/find-a-pair', async (req, res) => {
  const { username_1, username_2 } = req.query;

  if (!username_1 || !username_2) {
    return res.status(400).send({ error: 'Her iki kullanıcı adı da gerekli.' });
  }

  try {
    const chatRooms = await PrivateChatRoom.find({
      $or: [
        { user1: username_1, user2: username_2 },
        { user1: username_2, user2: username_1 }
      ]
    });

    res.status(200).send({ message: 'İki kullanıcının birebir odaları başarıyla getirildi.', data: chatRooms });
  } catch (error) {
    console.error('Kullanıcıların odaları alınırken hata:', error);
    res.status(500).send({ error: 'Kullanıcıların odaları alınırken bir hata oluştu.' });
  }
});

router.get('/all-rooms', async (req, res) => {
  try {
    const chatRooms = await PrivateChatRoom.find({});
    res.status(200).send({ message: 'Tüm özel odalar başarıyla getirildi.', data: chatRooms });
  } catch (error) {
    console.error('Özel odalar alınırken hata:', error);
    res.status(500).send({ error: 'Özel odalar alınırken bir hata oluştu.' });
  }
});


module.exports = router;
