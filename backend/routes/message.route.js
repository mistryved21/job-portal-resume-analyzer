import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all messages between two users
router.get('/:uid1/:uid2', async (req, res) => {
  const { uid1, uid2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: uid1, receiverId: uid2 },
        { senderId: uid2, receiverId: uid1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recruiter/Admin: Get unique chat users
router.get('/chats/:recruiterId', async (req, res) => {
  const { recruiterId } = req.params;
  try {
    const messages = await Message.find({
      $or: [{ senderId: recruiterId }, { receiverId: recruiterId }]
    });

    const userIds = [...new Set(
      messages.map(msg =>
        msg.senderId === recruiterId ? msg.receiverId : msg.senderId
      )
    )];

    res.json(userIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
