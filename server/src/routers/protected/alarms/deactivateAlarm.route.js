const express = require('express');
const router = express.Router();
const { deactivateAlarmController } = require('../../../controllers/alarms/deactivateAlarmController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.post('/', authMiddleware, deactivateAlarmController);

module.exports = router;