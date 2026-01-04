const express = require('express');
const router = express.Router();
const daysController = require('../../../controllers/alerts/daysController');

router.get('', daysController.getDays);

module.exports = router;