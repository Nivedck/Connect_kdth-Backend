// backend/routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/profile_pics';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 171345234.png
  }
});

const upload = multer({ storage });

// GET /api/user/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get /me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to backend/routes/user.js
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const users = await User.find({
      _id: { 
        $nin: [
          req.user.id,
          ...currentUser.friends,
          ...currentUser.friendRequests
        ]
      }
    })
    .select('name email profilePic')
    .limit(10);
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/me - Update profile
router.put('/me', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;

    if (req.file) {
      user.profilePic = `/uploads/profile_pics/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic
    };

    res.json(updatedUser);
  } catch (err) {
    console.error('Put /me error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
