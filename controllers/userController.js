// controllers/userController.js
const User = require('../models/User');
const { logActivity, allowedActions } = require('../utils/loggerActivity');

// Get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get one user by ID (admin/manager can view, user can only view self)
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role === 'user' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden: cannot view other users' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) 
      return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user (admin: can change role, manager: can update non-role fields, user: only self)
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Permission check
    if (req.user.role === 'user' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden: cannot update other users' });
    }

    const updates = { ...req.body };
    if (req.user.role === 'manager') {
      delete updates.role; // managers cannot change roles
    }
    if (req.user.role === 'user') {
      delete updates.role; // users cannot change role
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updated) 
      return res.status(404).json({ message: 'User not found' });

    // Log role changes
    if (updates.role) {
      await logActivity({
        userId: req.user._id,
        actionType: 'role_change',
        details: { targetUser: id, newRole: updates.role },
        req
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: only admin can delete users' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) 
      return res.status(404).json({ message: 'User not found' });

    await logActivity({
      userId: req.user._id,
      actionType: 'delete_user',
      details: { deletedUser: id },
      req
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
