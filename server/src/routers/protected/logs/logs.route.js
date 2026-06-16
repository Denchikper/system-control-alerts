const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { requirePermission } = require('../../../middleware/authorize');
const { getLogs, getLogLevels } = require('../../../controllers/logs/logController');

const canLogs = requirePermission('block:settings.logs');

router.get('/', authMiddleware, canLogs, getLogs);
router.get('/levels', authMiddleware, canLogs, getLogLevels);

module.exports = router;
