const express = require('express');
const router = express.Router();
const daysController = require('../../../controllers/alerts/daysController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/',authMiddleware, daysController.getDays);

module.exports = router;