const express = require('express');
const router = express.Router();
const { activateAlert } = require('../../controllers/alert/activateAlertController');

router.post('/', activateAlert);

module.exports = router;