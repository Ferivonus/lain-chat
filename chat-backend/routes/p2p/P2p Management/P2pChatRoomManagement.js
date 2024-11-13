const express = require('express');
const router = express.Router();
const PrivateChatRoom = require('../../../models/ChatRooms/p2pChatRoom');
const bcrypt = require('bcrypt');

// Create a new one-on-one chat room
router.post('/create', async (req, res) => {
  const { user1, user2, password } = req.body;

  if (!user1 || !user2 || !password) {
    return res.status(400).send({ error: 'Both usernames and password are required.' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newChatRoom = new PrivateChatRoom({ user1, user2, password: hashedPassword });
    await newChatRoom.save();
    res.status(201).send({ message: 'One-on-one chat room successfully created.', data: newChatRoom });
  } catch (error) {
    console.error('Error creating one-on-one chat room:', error);
    res.status(500).send({ error: 'An error occurred while creating the chat room.' });
  }
});

// Find private rooms between two users
router.get('/find-a-pair', async (req, res) => {
  const { username_1, username_2, password } = req.query;

  if (!username_1 || !username_2 || !password) {
    return res.status(400).send({ error: 'Both usernames and password are required.' });
  }

  try {
    const chatRoom = await PrivateChatRoom.findOne({
      $or: [
        { user1: username_1, user2: username_2 },
        { user1: username_2, user2: username_1 }
      ]
    });

    if (!chatRoom) {
      return res.status(404).send({ error: 'No chat room found between these users.' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, chatRoom.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Incorrect password.' });
    }

    res.status(200).send({ message: 'One-on-one chat room found successfully.', data: chatRoom });
  } catch (error) {
    console.error('Error retrieving chat room:', error);
    res.status(500).send({ error: 'An error occurred while retrieving the chat room.' });
  }
});

// Get all private rooms
router.get('/all-rooms', async (req, res) => {
  try {
    const chatRooms = await PrivateChatRoom.find({});
    res.status(200).send({ message: 'All private chat rooms retrieved successfully.', data: chatRooms });
  } catch (error) {
    console.error('Error retrieving all chat rooms:', error);
    res.status(500).send({ error: 'An error occurred while retrieving all chat rooms.' });
  }
});

module.exports = router;
