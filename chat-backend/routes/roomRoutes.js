const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).send('Error fetching rooms');
  }
});

router.post('/', async (req, res) => {
    const { room_name, creator_username } = req.body;

    if (!room_name || room_name.trim() === '' || !creator_username || creator_username.trim() === '') {
        return res.status(400).send('Room name and creator username are required');
    }

    try {
        const newRoom = new Room({ name: room_name, creator_username });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).send('Error creating room');
    }
});

module.exports = router;
