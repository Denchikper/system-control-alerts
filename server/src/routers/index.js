const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission, requireAnyPermission } = require('../middleware/authorize');

// Health-check без авторизации
router.get('/ping', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/auth/login', require('./auth/login.route'));
// Регистрация теперь только для тех, кто управляет пользователями
router.use('/auth/register', authMiddleware, requirePermission('block:settings.users'), require('./auth/register.route'));

// Вкл/выкл тревог — для раздела "Тревоги" или блока управления на дашборде
const canAlarmControl = requireAnyPermission(['section:alarms', 'block:dashboard.alarmControl']);
router.use('/alarm/activate', authMiddleware, canAlarmControl, require('./protected/alarms/activateAlarm.route'));
router.use('/alarm/deactivate', authMiddleware, canAlarmControl, require('./protected/alarms/deactivateAlarm.route'));

router.use('/user/get-profile', require('./protected/getProfile.route'));
router.use('/user/permissions', require('./protected/permissions/permissions.route'));

router.use('/user/duty-change-pass', authMiddleware, requirePermission('block:dashboard.changeDuty'), require('./protected/user/changeDutyPass.route'));
router.use('/user/change-pass', require('./protected/user/userChangePass.route'));

router.use('/server/server-time', authMiddleware, requirePermission('block:dashboard.systemStatus'), require('./protected/server/serverTime.route'));
router.use('/server/server-status', authMiddleware, requirePermission('block:dashboard.systemStatus'), require('./protected/server/serverStatus.route'));

router.use('/alarm', require('./protected/alarms/alarmAll.route'));
router.use('/device', authMiddleware, requirePermission('section:devices'), require('./protected/devices/devicesAll.route'));
router.use('/channel', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/channels/channelsAll.route'));

router.use('/alerts/days', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/alerts/daysRoutes.route'));
router.use('/alerts/schedules', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/alerts/scheduleRoutes.route'));
router.use('/alerts/scenarios', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/alerts/scenarioRoutes.route'));
router.use('/alerts/events', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/alerts/eventRoutes.route'));
router.use('/alerts/planned-alerts', authMiddleware, requirePermission('section:plannedalerts'), require('./protected/alerts/plannedAlertRoutes.route'));

// Управление пользователями и ролями (доступ внутри роутов по правам)
router.use('/users', require('./protected/users/usersAll.route'));
router.use('/roles', require('./protected/roles/rolesAll.route'));
router.use('/logs', require('./protected/logs/logs.route'));


module.exports = router;
