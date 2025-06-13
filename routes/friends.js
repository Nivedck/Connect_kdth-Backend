const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');




// Send Friend Request using email or name
router.post('/request', auth, async (req, res) => {
  try {
    const { identifier } = req.body;

    // Try finding user by email first, then by name
    const targetUser = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    const currentUser = await User.findById(req.user.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser._id.equals(currentUser._id))
      return res.status(400).json({ message: 'You cannot add yourself' });

    if (targetUser.friendRequests.includes(currentUser._id))
      return res.status(400).json({ message: 'Request already sent' });

    if (targetUser.friends.includes(currentUser._id))
      return res.status(400).json({ message: 'Already friends' });

    targetUser.friendRequests.push(currentUser._id);
    await targetUser.save();

    res.json({ message: 'Friend request sent to ' + targetUser.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to backend/routes/friends.js
router.post('/unfriend', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from current user's friends list
    currentUser.friends = currentUser.friends.filter(
      friendId => friendId.toString() !== targetUser._id.toString()
    );

    // Remove from target user's friends list
    targetUser.friends = targetUser.friends.filter(
      friendId => friendId.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error('Unfriend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept Friend Request using name or email
router.post('/accept', auth, async (req, res) => {
  try {
    const { identifier } = req.body;

    const receiver = await User.findById(req.user.id);
    const sender = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

    if (!receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: 'No request from this user' });
    }

    if (!receiver.friends.includes(sender._id)) {
      receiver.friends.push(sender._id);
    }

    if (!sender.friends.includes(receiver._id)) {
      sender.friends.push(receiver._id);
    }

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());

    await receiver.save();
    await sender.save();

    res.json({ message: `Friend request accepted from ${sender.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject Friend Request
router.post('/reject', auth, async (req, res) => {
  try {
    const { identifier } = req.body;
    const receiver = await User.findById(req.user.id);
    const sender = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: 'No request from this user' });
    }

    // Remove friend request
    receiver.friendRequests = receiver.friendRequests.filter(
      id => id.toString() !== sender._id.toString()
    );

    await receiver.save();

    res.json({ message: `Friend request rejected from ${sender.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Pending Friend Requests
router.get('/pending', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests', 'name email profilePic'); // Add profilePic to populated fields
    res.json(user.friendRequests);
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
