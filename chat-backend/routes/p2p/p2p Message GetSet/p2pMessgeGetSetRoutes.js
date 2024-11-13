const express = require('express');
const router = express.Router();
const Message = require('../../models/ChatRooms/p2pMessage');

// Send a message to a specific chat (based on chatId)
router.post('/send', async (req, res) => {
  const { chatId, username, message } = req.body;

  if (!chatId || !username || !message) {
    return res.status(400).send({ error: 'chatId, username, and message are required.' });
  }

  try {
    const newMessage = new Message({
      chatId,
      username,
      message,
    });

    await newMessage.save();
    res.status(201).send({ message: 'Message sent successfully.', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ error: 'An error occurred while sending the message.' });
  }
});

// Get all messages from a specific chat (based on chatId)
router.get('/get', async (req, res) => {
  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).send({ error: 'chatId is required.' });
  }

  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });  // Sort by timestamp to show messages in order

    res.status(200).send({ message: 'Messages retrieved successfully.', data: messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send({ error: 'An error occurred while retrieving the messages.' });
  }
});

module.exports = router;
