const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true,
    index: true       // for faster lookups
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '7d'              // auto-delete after 7 days 
  } 
  
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
