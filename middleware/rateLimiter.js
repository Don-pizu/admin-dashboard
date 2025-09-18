// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 8 login requests per windowMs
  message: { message: 'Too many login attempts from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
