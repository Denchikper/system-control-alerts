const express = require('express');
const router = express.Router();
const { serverTimeController } = require('../../../controllers/server/serverTimeController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/', authMiddleware, serverTimeController);

module.exports = router;