// controllers/logsController.js
//view and export logs
const LogActivity = require('../models/logActivity');
const mongoose = require('mongoose');
const { Parser } = require('json2csv'); // for CSV export (install json2csv)

const DEFAULT_PAGE_SIZE = 50;



//GET     get logs
exports.getLogs = async (req, res, next) => {
  try {
    // filters: user, actionType, from, to, page, limit
    const { user, actionType, from, to, page = 1, limit = DEFAULT_PAGE_SIZE } = req.query;

    const filter = {};

    if (user && mongoose.Types.ObjectId.isValid(user))
     filter.user = user;
    if (actionType) 
      filter.actionType = actionType;
    if (from || to) 
      filter.createdAt = {};
    if (from) 
      filter.createdAt.$gte = new Date(from);
    if (to) 
      filter.createdAt.$lte = new Date(to);

    const skip = (Math.max(1, +page) - 1) * limit;

    const logs = await LogActivity.find(filter)
                                      .sort({ createdAt: -1 })
                                      .skip(skip)
                                      .limit(+limit)
                                      .populate('user', 'name email role');

    const total = await LogActivity.countDocuments(filter);

    res.json({ total, page: +page, limit: +limit, data: logs });
  } catch (err) {
    next(err);
  }
};




// DELETE  Delete log by id
exports.deleteLogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid log ID' });
    }

    const deletedLog = await LogActivity.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json({
      message: 'Log deleted successfully',
      logId: id
    });
  } catch (err) {
    next(err);
  }
};



//Delete   Delete all logs 

exports.deleteLogs = async (req, res, next) => {
  try {
    const { beforeDate } = req.query;

    const filter = {};
    if (beforeDate) 
      filter.createdAt = { $lte: new Date(beforeDate) };

    const result = await LogActivity.deleteMany(filter);

    res.json({ 
      message: 'Logs deleted successfully', 
      deletedCount: result.deletedCount 
    });

  } catch (err) {
    next(err);
  }
};



//GET EXPORT csvlogs (admin & manager)
exports.exportLogs = async (req, res, next) => {
  try {
    // same filters as getLogs
    const { user, actionType, from, to, format = 'json' } = req.query;

    const filter = {};

    if (user) 
      filter.user = user;
    if (actionType) 
      filter.actionType = actionType;
    if (from || to) 
      filter.createdAt = {};
    if (from) 
      filter.createdAt.$gte = new Date(from);
    if (to) 
      filter.createdAt.$lte = new Date(to);

    const logs = await LogActivity.find(filter)
                                      .sort({ createdAt: -1 })
                                      .populate('user', 'name email role')
                                      .lean();

    if (format === 'csv') {
      const fields = ['_id', 'user._id', 'user.name', 'user.email', 'actionType', 'details', 'ip', 'userAgent', 'createdAt'];
      const parser = new Parser({ fields });
      const csv = parser.parse(logs.map(l => l.toObject({ flatten: true })));
      res.header('Content-Type', 'text/csv');
      res.attachment('activity-logs.csv');
      return res.send(csv);
    }

    res.json({ total: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};
