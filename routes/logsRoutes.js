// routes/logsRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { getLogs, deleteLogById, deleteLogs, exportLogs } = require('../controllers/logsController');

// Admin can view and delete all logs 
router.get('/logs', protect, requireRole('admin'), getLogs);
router.delete('/logs/:id', protect, requireRole('admin'), deleteLogById);
router.delete('/logs', protect, requireRole('admin'), deleteLogs);

// Manager can view logs but filtered — manager should pass filters (user/date)
router.get('/export', protect, requireRole('admin','manager'), exportLogs);

module.exports = router;
