const Role = require('../models/Role');
const { ADMIN_ROLE } = require('../config/permissions');

// Загружает роль текущего пользователя (req.user проставляет authMiddleware).
async function loadRole(req) {
  if (!req.user || !req.user.role) return null;
  return Role.findOne({ where: { name: req.user.role } });
}

// Требует конкретное право. admin / системная роль проходят всегда.
function requirePermission(key) {
  return async (req, res, next) => {
    try {
      const role = await loadRole(req);
      if (!role) return res.status(403).json({ message: 'Роль не найдена' });
      if (role.is_system || role.name === ADMIN_ROLE) return next();
      if (Array.isArray(role.permissions) && role.permissions.includes(key)) return next();
      return res.status(403).json({ message: 'Недостаточно прав' });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка проверки прав' });
    }
  };
}

// Требует хотя бы одно из прав.
function requireAnyPermission(keys) {
  return async (req, res, next) => {
    try {
      const role = await loadRole(req);
      if (!role) return res.status(403).json({ message: 'Роль не найдена' });
      if (role.is_system || role.name === ADMIN_ROLE) return next();
      const perms = Array.isArray(role.permissions) ? role.permissions : [];
      if (keys.some((k) => perms.includes(k))) return next();
      return res.status(403).json({ message: 'Недостаточно прав' });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка проверки прав' });
    }
  };
}

// Только admin / системная роль.
function requireAdmin(req, res, next) {
  loadRole(req)
    .then((role) => {
      if (role && (role.is_system || role.name === ADMIN_ROLE)) return next();
      return res.status(403).json({ message: 'Требуются права администратора' });
    })
    .catch(() => res.status(500).json({ message: 'Ошибка проверки прав' }));
}

module.exports = { requirePermission, requireAnyPermission, requireAdmin };
