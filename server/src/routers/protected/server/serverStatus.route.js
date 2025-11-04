const express = require('express');
const router = express.Router();
const { serverStatusController } = require('../../../controllers/server/serverStatusController');
const authMiddleware = require('../../../middleware/authMiddleware');

router.get('/', authMiddleware, serverStatusController);

module.exports = router;