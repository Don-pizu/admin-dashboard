// controllers/statsController.js
const User = require('../models/User');
const LogActivity = require('../models/logActivity');
const mongoose = require('mongoose');


//Get numbers of users by role
exports.usersByRole = async (req, res, next) => {
  try {
    const pipeline = [
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { role: '$_id', count: 1, _id: 0 } }
    ];
    const result = await User.aggregate(pipeline);

    // normalize to include roles with 0
    const roles = ['admin', 'manager', 'user'];
    const map = Object.fromEntries(result.map(r => [r.role, r.count]));
    const out = roles.map(r => ({ role: r, count: map[r] || 0 }));
    res.json(out);
  } catch (err) {
    next(err);
  }
};

//GET  Count of successful vs failed login attempts.
exports.loginAttempts = async (req, res, next) => {
  try {

    // activity logs: actionType 'login_success' or 'login_failed'
    const pipeline = [
      { $match: { actionType: { $in: ['login_success', 'login_failed'] } } },
      { $group: { _id: '$actionType', count: { $sum: 1 } } },
      { $project: { action: '$_id', count: 1, _id: 0 } }
    ];
    const result = await LogActivity.aggregate(pipeline);
    const map = Object.fromEntries(result.map(r => [r.action, r.count]));
    res.json({
      successful: map['login_success'] || 0,
      failed: map['login_failed'] || 0
    });
  } catch (err) {
    next(err);
  }
};


//GET  Users logged in within the last 24 hours
exports.activeUsers = async (req, res, next) => {
  try {
    // users who had a login_success within last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const pipeline = [
      { $match: { actionType: 'login_success', createdAt: { $gte: since } } },
      { $group: { _id: '$user' } },
      { $count: 'activeUsers' }
    ];
    const result = await LogActivity.aggregate(pipeline);
    const activeCount = (result[0] && result[0].activeUsers) || 0;
    res.json({ activeUsers: activeCount });
  } catch (err) {
    next(err);
  }
};
