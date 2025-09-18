// models/User.js

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');    // For hashing password

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
  },
    email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },

  password: { 
    type: String, 
    required: true,
    minlength: 6, 
  },
  role: { 
    type: String, 
    enum: ['user','manager', 'admin'], 
    default: 'user' 
  }

  },
  { timestamps: true }
);

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password'))
    return next();          /// If password id not change

  const salt = await bcrypt.genSalt(10);   //Generate salt
  this.password = await bcrypt.hash(this.password, salt);  //Hash password
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);     //using bcrypt to compare passwords
};

module.exports = mongoose.model("User", userSchema);
