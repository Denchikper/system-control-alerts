const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getProfile } = require('../../controllers/getProfileController');

// GET /api/user/profile
router.get('/', authMiddleware, getProfile);

module.exports = router;