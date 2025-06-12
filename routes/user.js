// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup multer for profile pic uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store in /uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '_profile' + ext); // Unique filename per user
  }
});

const upload = multer({ storage: storage });

/**
 * GET /api/user/me
 * Get current user's profile
 */
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

/**
 * PUT /api/user/me
 * Update current user's profile (bio or profilePic)
 */
router.put('/me', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const update = {};
    if (req.body.bio) update.bio = req.body.bio;
    if (req.file) update.profilePic = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Update /me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/user/:id
 * Get another user's profile if they are friends
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.id);

    if (!currentUser.friends.includes(req.params.id)) {
      return res.status(403).json({ message: 'Access denied – not friends' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get user by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
