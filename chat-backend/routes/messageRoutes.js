const express = require('express');
const router = express.Router();
const Message = require('../models/Message');  // Import the message model

// Send message (POST)
router.post('/send', async (req, res) => {
  const { roomId, message, username } = req.body;  // Extract roomId and message from the request body

  // Validate roomId
  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    return res.status(400).send({ error: 'Room ID is required and must be valid.' });
  }

  // Validate message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).send({ error: 'Message is required and must be valid.' });
  }

  // Validate username (optional)
  if (username && (typeof username !== 'string' || username.trim() === '')) {
    return res.status(400).send({ error: 'Invalid username.' });
  }

  try {
    // Save the new message to MongoDB
    const newMessage = new Message({
      roomId: roomId,
      message: message,
      username: username,
    });

    await newMessage.save();

    console.log('Message saved:', newMessage);
    res.status(200).send({ message: 'Message received and saved.', data: newMessage });  // Return the saved message
  } catch (err) {
    console.error('Error saving the message:', err);
    res.status(500).send({ error: 'An error occurred while saving the message.', details: err.message });
  }
});

// Get messages (GET)
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;  // Extract roomId from URL parameters

  // Validate roomId
  if (!roomId) {
    return res.status(400).send({ error: 'Room ID is required.' });
  }

  try {
    // Fetch and sort messages by roomId and timestamp (newest first)
    const messages = await Message.find({ roomId: roomId }).sort({ timestamp: -1 });

    // Check if no messages found
    if (messages.length === 0) {
      return res.status(404).send({ error: 'No messages found.' });
    }

    console.log('Messages:', messages);
    res.status(200).send({ messages: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send({ error: 'An error occurred while fetching messages.', details: err.message });
  }
});

module.exports = router;
