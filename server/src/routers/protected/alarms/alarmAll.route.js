const express = require('express');
const router = express.Router();
const alarmController = require('../../../controllers/alarms/alarmController');
const authMiddleware = require('../../../middleware/authMiddleware');

// GET /api/alarms
router.get('/', authMiddleware, alarmController.getAllAlarms);

// POST /api/alarms
router.post('/', authMiddleware, alarmController.createAlarm);

// PUT /api/alarms/:id
router.put('/:id', authMiddleware, alarmController.updateAlarm);

// DELETE /api/alarms/:id
router.delete('/:id', authMiddleware, alarmController.deleteAlarm);

module.exports = router;