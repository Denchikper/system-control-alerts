const express = require('express');
const router = express.Router();
const scheduleController = require('../../../controllers/alerts/scheduleController');

router.get('/', scheduleController.getSchedules);
router.get('/active', scheduleController.getSchedulesActive);
router.put('/activate/:id', scheduleController.activateSchedule);
router.post('/', scheduleController.createSchedule);
router.put('/:id', scheduleController.updateSchedule);

module.exports = router;