// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/refreshToken');
const { logActivity, allowedActions } = require('../utils/loggerActivity');

//Generate JWT access Token
const createToken = (user) => {             // Create short-lived access token
  return jwt.sign (
    {id: user._id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
    );
};

//Generate JWT refresh Token
const createRefreshToken = async (user) => {            // Create refresh token and save to DB
  const token = jwt.sign (
    {id: user._id},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: '7d'}
  );

  await new RefreshToken({ user: user._id, token }).save();  // save user id an the refresh token in refreshToken schema
  return token;
};


//POST   Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
    return res.status(400).json({ message: 'All the fields are required'});

    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });


    res.status(201).json({ 
      message: 'User created successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//POST   login
// POST login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Log failed attempt (user not found)
      await logActivity({
        userId: null,
        actionType: allowedActions.LOGIN_FAILED,
        details: { email },
        req
      });
      return res.status(401).json({ message: 'User not found' });
    }

    const matchPass = await user.matchPassword(password);
    if (!matchPass) {
      // Log failed attempt (wrong password)
      await logActivity({
        userId: user._id,
        actionType: allowedActions.LOGIN_FAILED,
        details: { email },
        req
      });
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // ✅ Successful login
    const accessToken = createToken(user);
    const refreshToken = await createRefreshToken(user);

    // Send refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // Log successful login
    await logActivity({
      userId: user._id,
      actionType: allowedActions.LOGIN_SUCCESS,
      details: { email: user.email },
      req
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
      refresh: refreshToken
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//POST  Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) 
      return res.status(401).json({ message: 'Refresh token required' });

    // Verify and check token in DB
    let userPayload;

    try {
      userPayload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const stored = await RefreshToken.findOne({ token });
    if (!stored) 
      return res.status(401).json({ message: 'Refresh token revoked' });

    // Issue new access token
    const user = await User.findById(userPayload.id);
    if (!user) 
      return res.status(401).json({ message: 'User not found' });

    const accessToken = createToken(user);
    res.json({ accessToken });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// POST  Logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      await RefreshToken.findOneAndDelete({ token });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

