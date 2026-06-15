const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { requirePermission, requireAnyPermission } = require('../../../middleware/authorize');
const { getRoles, createRole, updateRole, deleteRole } = require('../../../controllers/roles/roleController');

const canRoles = requirePermission('block:settings.roles');
// Список ролей нужен и тем, кто управляет пользователями (для назначения роли)
const canReadRoles = requireAnyPermission(['block:settings.roles', 'block:settings.users']);

router.get('/', authMiddleware, canReadRoles, getRoles);
router.post('/', authMiddleware, canRoles, createRole);
router.put('/:id', authMiddleware, canRoles, updateRole);
router.delete('/:id', authMiddleware, canRoles, deleteRole);

module.exports = router;
