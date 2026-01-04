const express = require('express');
const router = express.Router();
const plannedAlertController = require('../../../controllers/alerts/plannedAlertController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/', authMiddleware, plannedAlertController.getPlannedAlerts);
router.post('/', authMiddleware, plannedAlertController.createPlannedAlert);

module.exports = router;