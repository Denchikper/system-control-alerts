const express = require('express');
const router = express.Router();

router.use('/auth/login', require('./auth/login.route'));
router.use('/auth/register', require('./auth/register.route'));

router.use('/alarm/activate', require('./protected/alarms/activateAlarm.route'));
router.use('/alarm/deactivate', require('./protected/alarms/deactivateAlarm.route'));

router.use('/user/get-profile', require('./protected/getProfile.route'));

router.use('/user/duty-change-pass', require('./protected/user/changeDutyPass.route'));
router.use('/user/change-pass', require('./protected/user/userChangePass.route'));

router.use('/server/server-time', require('./protected/server/serverTime.route'));
router.use('/server/server-status', require('./protected/server/serverStatus.route'));

router.use('/alarm', require('./protected/alarms/alarmAll.route'));
router.use('/device', require('./protected/devices/devicesAll.route'));
 

module.exports = router;