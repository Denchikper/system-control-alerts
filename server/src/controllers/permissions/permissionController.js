const Role = require('../../models/Role');
const { CATALOG, ALL_KEYS, ADMIN_ROLE } = require('../../config/permissions');

// Каталог всех прав (для редактора ролей)
exports.getCatalog = (req, res) => {
  res.json(CATALOG);
};

// Эффективные права текущего пользователя (для гейтинга на фронте)
exports.getMyPermissions = async (req, res) => {
  try {
    const roleName = req.user?.role;
    const role = await Role.findOne({ where: { name: roleName } });
    const isAdmin = !!role && (role.is_system || role.name === ADMIN_ROLE);
    const permissions = isAdmin ? ALL_KEYS : (role?.permissions || []);
    res.json({ role: roleName, isAdmin, permissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
