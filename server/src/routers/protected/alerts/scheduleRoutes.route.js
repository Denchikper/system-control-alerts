const express = require('express');
const router = express.Router();
const scheduleController = require('../../../controllers/alerts/scheduleController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/', authMiddleware, scheduleController.getSchedules);
router.get('/active', authMiddleware, scheduleController.getSchedulesActive);
router.put('/activate/:id', authMiddleware, scheduleController.activateSchedule);
router.post('/', authMiddleware, scheduleController.createSchedule);
router.put('/:id', authMiddleware, scheduleController.updateSchedule);
router.delete('/:id', authMiddleware, scheduleController.deleteSchedules);

module.exports = router;