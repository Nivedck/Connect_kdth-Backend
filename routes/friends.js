// routes/friends.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Send Friend Request
router.post('/add/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser.friendRequests.includes(currentUser._id))
      return res.status(400).json({ message: 'Request already sent' });

    if (targetUser.friends.includes(currentUser._id))
      return res.status(400).json({ message: 'Already friends' });

    targetUser.friendRequests.push(currentUser._id);
    await targetUser.save();

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept Friend Request
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const sender = await User.findById(req.params.id);
    const receiver = await User.findById(req.user.id);

    if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

    if (!receiver.friendRequests.includes(sender._id))
      return res.status(400).json({ message: 'No request from this user' });

    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());

    await receiver.save();
    await sender.save();

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Friends List
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'name email profilePic');
    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
