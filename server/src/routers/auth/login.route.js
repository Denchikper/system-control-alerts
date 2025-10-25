const express = require('express');
const router = express.Router();
const { login } = require('../../controllers/auth/loginController');

router.post('/', login);

module.exports = router;