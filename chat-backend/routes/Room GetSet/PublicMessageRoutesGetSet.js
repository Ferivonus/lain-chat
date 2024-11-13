const express = require('express');
const router = express.Router();
const Message = require('../../models/messages/GroupMessage');  

router.post('/send', async (req, res) => {
  const { roomId, message, username } = req.body;
  console.log('Request Body:', req.body);
  console.log('Room id: ', roomId);
  console.log('message: ', message);
  console.log('username: ', username);

  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    return res.status(400).send({ error: 'Room ID is required and must be valid.' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).send({ error: 'Message is required and must be valid.' });
  }

  if (username && (typeof username !== 'string' || username.trim() === '')) {
    return res.status(400).send({ error: 'Invalid username.' });
  }

  try {
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


// Fetch messages by roomId
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
    console.log('Request Body:', req.body);  // Burada gelen body'i yazdırıyoruz


  if (!roomId) {
    return res.status(400).json({ success: false, error: 'Room ID is required.' });
  }

  try {
    // Fetch messages sorted by timestamp in descending order
    const messages = await Message.find({ roomId }).sort({ timestamp: -1 });

    if (messages.length === 0) {
      return res.status(404).json({ success: false, error: 'No messages found.' });
    }

    // Construct the response data
    const responseData = {
      roomId: roomId,
      messages: messages.map(msg => ({
        username: msg.username,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
    };

    console.log('Messages:', responseData);
    // Return the structured response with room ID, usernames, messages, and timestamps
    res.status(200).json({ success: true, data: responseData });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'An error occurred while fetching messages.', details: err.message });
  }
});

module.exports = router;