const express = require('express');
const router = express.Router();
const eventController = require('../../../controllers/alerts/eventController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/:scenario_id', authMiddleware, eventController.getEventsByScenario);
router.delete('/:event_id', authMiddleware, eventController.deleteEventsByID);
router.post('/', authMiddleware, eventController.createEvent);
router.patch('/:id', authMiddleware, eventController.updateEvent);

module.exports = router;