// privateMessages.js
const express = require('express');
const router = express.Router();
const Message = require('../../../models/messages/PrivateMessage');

// Send a private message
router.post('/send', async (req, res) => {
  const { chatId, message, username } = req.body;
    console.log('Request Body:', req.body);  // Burada gelen body'i yazdırıyoruz


  if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
    return res.status(400).json({ success: false, error: 'Chat ID is required and must be valid.' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Message is required and must be valid.' });
  }

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ success: false, error: 'Username is required and must be valid.' });
  }

  try {
    const newMessage = new Message({
      chatId,
      message,
      username,
    });

    await newMessage.save();

    console.log('Private message saved:', newMessage);
    res.status(200).json({ success: true, message: 'Message received and saved.', data: newMessage });
  } catch (err) {
    console.error('Error saving the private message:', err);
    res.status(500).json({ success: false, error: 'An error occurred while saving the private message.', details: err.message });
  }
});

// Fetch private messages by chatId
router.get('/:chatId', async (req, res) => {
  const { chatId } = req.params;
    console.log('Request Body:', req.body);  // Burada gelen body'i yazdırıyoruz


  if (!chatId) {
    return res.status(400).json({ success: false, error: 'Chat ID is required.' });
  }

  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: -1 });

    if (messages.length === 0) {
      return res.status(404).json({ success: false, error: 'No messages found.' });
    }

    console.log('Fetched private messages:', messages);
    res.status(200).json({
      success: true,
      data: messages.map((msg) => ({
        id: msg._id,
        username: msg.username,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
    });
  } catch (err) {
    console.error('Error fetching private messages:', err);
    res.status(500).json({ success: false, error: 'An error occurred while fetching private messages.', details: err.message });
  }
});

module.exports = router;
