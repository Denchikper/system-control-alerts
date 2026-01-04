const express = require('express');
const router = express.Router();
const { activateAlarmController } = require('../../../controllers/alarms/activateAlarmController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.post('/', authMiddleware, activateAlarmController);

module.exports = router;