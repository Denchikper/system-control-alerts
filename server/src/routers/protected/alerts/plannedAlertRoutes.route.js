const express = require('express');
const router = express.Router();
const plannedAlertController = require('../../../controllers/alerts/plannedAlertController');

router.get('/', plannedAlertController.getPlannedAlerts);
router.post('/', plannedAlertController.createPlannedAlert);

module.exports = router;