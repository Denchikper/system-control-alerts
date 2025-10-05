const express = require('express');
const router = express.Router();
const { deactivateAlert } = require('../../controllers/alert/deactivateAlertController');

router.post('/', deactivateAlert);

module.exports = router;