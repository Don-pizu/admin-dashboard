// models/logActivity.js
const mongoose = require('mongoose');

const logActivitySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  actionType: { 
    type: String, 
    required: true 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed 
  }, 
  ip: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  createdAt: { 
  type: Date, 
  default: Date.now, 
  index: true 
}
});

module.exports = mongoose.model('LogActivity', logActivitySchema);
