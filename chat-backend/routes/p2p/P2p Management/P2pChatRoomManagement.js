const express = require('express');
const router = express.Router();
const PrivateChatRoom = require('../../../models/ChatRooms/p2pChat');

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

router.get('/check-the-pair', async (req, res) => {
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

    const isMatch = bcrypt.compare(password, chatRoom.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Incorrect password.' });
    }

    res.status(200).send({ message: 'Access to the one-on-one chat room is verified.', data: chatRoom });
  } catch (error) {
    console.error('Error verifying chat room access:', error);
    res.status(500).send({ error: 'An error occurred while verifying the chat room access.' });
  }
});

// Get all private rooms for a specific user
router.get('/my-rooms', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: 'Username is required to retrieve your rooms.' });
  }

  try {
    // Find all chat rooms where the user is a participant
    const chatRooms = await PrivateChatRoom.find({
      $or: [{ user1: username }, { user2: username }]
    });

    if (chatRooms.length === 0) {
      return res.status(404).send({ message: 'No chat rooms found for this user.' });
    }

    res.status(200).send({ message: 'User-specific private chat rooms retrieved successfully.', data: chatRooms });
  } catch (error) {
    console.error('Error retrieving user-specific chat rooms:', error);
    res.status(500).send({ error: 'An error occurred while retrieving the chat rooms.' });
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
