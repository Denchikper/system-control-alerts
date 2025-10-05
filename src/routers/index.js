const express = require('express');
const router = express.Router();

router.use('/auth/login', require('./auth/login.route'));
router.use('/auth/register', require('./auth/register.route'));

router.use('/alert/activate', require('./alert/activateAlert.route'));
router.use('/alert/deactivate', require('./alert/deactivateAlert.route'));
 

module.exports = router;