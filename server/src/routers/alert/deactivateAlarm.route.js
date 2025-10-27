const express = require('express');
const router = express.Router();
const { deactivateAlarmController } = require('../../controllers/alarm/deactivateAlarmController');

router.post('/', deactivateAlarmController);

module.exports = router;