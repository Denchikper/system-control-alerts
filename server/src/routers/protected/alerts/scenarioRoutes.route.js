const express = require('express');
const router = express.Router();
const scenarioController = require('../../../controllers/alerts/scenarioController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/bySchedule/:schedule_id', authMiddleware, scenarioController.getScenarios);
router.post('/byday', authMiddleware,scenarioController.getScenariosByDay);
router.post('/', authMiddleware, scenarioController.createScenario);

module.exports = router;