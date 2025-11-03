const express = require('express');
const router = express.Router();
const { activateAlarmController } = require('../../../controllers/alarms/activateAlarmController');

router.post('/', activateAlarmController);

module.exports = router;