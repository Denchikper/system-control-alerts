const express = require('express');
const router = express.Router();
const alarmController = require('../../../controllers/alarms/alarmController');
const authMiddleware = require('../../../middleware/authMiddleware');
const { requirePermission, requireAnyPermission } = require('../../../middleware/authorize');

// Список тревог нужен и разделу "Тревоги", и блоку управления на дашборде
const canRead = requireAnyPermission(['section:alarms', 'block:dashboard.alarmControl']);
// Изменять определения тревог можно только в разделе "Тревоги"
const canManage = requirePermission('section:alarms');

// GET /api/alarm
router.get('/', authMiddleware, canRead, alarmController.getAllAlarms);

// POST /api/alarm
router.post('/', authMiddleware, canManage, alarmController.createAlarm);

// PUT /api/alarm/:id
router.put('/:id', authMiddleware, canManage, alarmController.updateAlarm);

// DELETE /api/alarm/:id
router.delete('/:id', authMiddleware, canManage, alarmController.deleteAlarm);

module.exports = router;