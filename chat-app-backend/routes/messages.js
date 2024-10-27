// routes/messages.js
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get messages between two users
router.get('/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Send message (optional if using Socket.IO for this)
router.post('/', async (req, res) => {
    const { sender, receiver, content } = req.body;
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json(message);
});

module.exports = router;
