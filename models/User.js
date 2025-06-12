const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: ''
  },

  profilePic: {
    type: String,
    default: '' // Store file path or URL
  },

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
