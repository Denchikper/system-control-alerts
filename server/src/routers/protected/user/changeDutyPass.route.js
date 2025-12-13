const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { dutyChangePassController } = require('../../../controllers/user/dutyChangePassController');

router.patch('/', authMiddleware, dutyChangePassController);

module.exports = router;