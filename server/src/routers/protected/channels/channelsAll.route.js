const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { getAllChannels } = require('../../../controllers/channels/channelController');

// GET /api/channel
router.get('/', authMiddleware, getAllChannels);

module.exports = router;
