const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { getCatalog, getMyPermissions } = require('../../../controllers/permissions/permissionController');

// Каталог прав (для редактора ролей) и эффективные права текущего пользователя
router.get('/catalog', authMiddleware, getCatalog);
router.get('/me', authMiddleware, getMyPermissions);

module.exports = router;
