const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { requirePermission } = require('../../../middleware/authorize');
const { getUsers, createUser, updateUser, deleteUser } = require('../../../controllers/users/userManageController');

const canUsers = requirePermission('block:settings.users');

router.get('/', authMiddleware, canUsers, getUsers);
router.post('/', authMiddleware, canUsers, createUser);
router.put('/:id', authMiddleware, canUsers, updateUser);
router.delete('/:id', authMiddleware, canUsers, deleteUser);

module.exports = router;
