const express = require('express');
const router = express.Router();
const { register } = require('../../controllers/auth/registerController');

router.post('/', register);

module.exports = router;