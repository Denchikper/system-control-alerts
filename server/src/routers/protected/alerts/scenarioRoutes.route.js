const express = require('express');
const router = express.Router();
const scenarioController = require('../../../controllers/alerts/scenarioController');

router.get('/:schedule_id', scenarioController.getScenarios);
router.post('/', scenarioController.createScenario);

module.exports = router;