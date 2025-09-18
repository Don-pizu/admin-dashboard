// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { usersByRole, loginAttempts, activeUsers} = require('../controllers/statsController');

// Admin and Manager can view stats; user cannot
router.get('/users', protect, requireRole('admin','manager'), usersByRole);
router.get('/logins', protect, requireRole('admin','manager'), loginAttempts);
router.get('/active-users', protect, requireRole('admin','manager'), activeUsers);

module.exports = router;
