// utils/loggerActivity.js
const LogActivity = require('../models/logActivity');

const allowedActions = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  ROLE_CHANGE: 'role_change'
  
};

async function logActivity({ userId = null, actionType, details = {}, req = null }) {
  try {
    const ip = req ? (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress) : undefined;
    const userAgent = req ? req.headers['user-agent'] : undefined;

    // normalize to lowercase with underscores
    const normalized = String(actionType).toLowerCase().replace(':', '_');

    await LogActivity.create({
      user: userId,
      actionType: normalized,
      details,
      ip,
      userAgent
    });
  } catch (err) {
    console.error('Activity log error:', err);
  }
}

module.exports = { logActivity, allowedActions };
