const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { userChangePassController } = require('../../../controllers/user/userChangePassController');

router.patch('/', authMiddleware, userChangePassController);

module.exports = router;