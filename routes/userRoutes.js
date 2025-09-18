// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { getUsers, getUserById, updateUser, deleteUser} = require('../controllers/userController');

router.use(protect);

// Admin only
router.get('/users', requireRole('admin'), getUsers);

// Admin, manager, and user (with self-restrictions)
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);

// Admin only delete
router.delete('/users/:id', requireRole('admin'), deleteUser);

module.exports = router;
