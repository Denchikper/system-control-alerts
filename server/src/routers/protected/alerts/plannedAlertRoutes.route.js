const express = require('express');
const router = express.Router();
const plannedAlertController = require('../../../controllers/alerts/plannedAlertController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/', authMiddleware, plannedAlertController.getPlannedAlerts);
router.post('/', authMiddleware, plannedAlertController.createPlannedAlert);
router.put('/:id', authMiddleware, plannedAlertController.updatePlannedAlert);
router.patch('/:id/toggle', authMiddleware, plannedAlertController.togglePlannedAlert);
router.delete('/:id', authMiddleware, plannedAlertController.deletePlannedAlert);

module.exports = router;