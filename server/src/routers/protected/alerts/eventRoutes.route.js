const express = require('express');
const router = express.Router();
const eventController = require('../../../controllers/alerts/eventController');

router.get('/:scenario_id', eventController.getEventsByScenario);
router.post('/', eventController.createEvent);

module.exports = router;