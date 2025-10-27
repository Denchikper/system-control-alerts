const express = require('express');
const router = express.Router();

router.use('/auth/login', require('./auth/login.route'));
router.use('/auth/register', require('./auth/register.route'));

router.use('/alarm/activate', require('./alert/activateAlarm.route'));
router.use('/alarm/deactivate', require('./alert/deactivateAlarm.route'));

router.use('/user/get-profile', require('./protected/getProfile.route'));
 

module.exports = router;