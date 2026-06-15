const Role = require('../../models/Role');
const User = require('../../models/User');
const { ALL_KEYS, ADMIN_ROLE } = require('../../config/permissions');

// Оставляем только валидные ключи прав
function sanitizePermissions(permissions) {
  if (!Array.isArray(permissions)) return [];
  return [...new Set(permissions.filter((p) => ALL_KEYS.includes(p)))];
}

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [['id', 'ASC']] });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Название роли обязательно' });
    }
    const exists = await Role.findOne({ where: { name: name.trim() } });
    if (exists) return res.status(409).json({ error: 'Роль с таким названием уже существует' });

    const role = await Role.create({
      name: name.trim(),
      permissions: sanitizePermissions(permissions),
      is_system: false,
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: 'Роль не найдена' });

    const { name, permissions } = req.body;

    // У системной роли (admin) права менять нельзя — всегда полный доступ
    if (role.is_system) {
      return res.status(400).json({ error: 'Системную роль изменять нельзя' });
    }

    if (name !== undefined && name.trim()) {
      const dup = await Role.findOne({ where: { name: name.trim() } });
      if (dup && dup.id !== role.id) {
        return res.status(409).json({ error: 'Роль с таким названием уже существует' });
      }
      const oldName = role.name;
      role.name = name.trim();
      // Переименование роли — обновляем у пользователей
      if (oldName !== role.name) {
        await User.update({ role: role.name }, { where: { role: oldName } });
      }
    }
    if (permissions !== undefined) role.permissions = sanitizePermissions(permissions);

    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: 'Роль не найдена' });
    if (role.is_system || role.name === ADMIN_ROLE) {
      return res.status(400).json({ error: 'Системную роль удалять нельзя' });
    }
    const inUse = await User.count({ where: { role: role.name } });
    if (inUse > 0) {
      return res.status(409).json({ error: `Роль назначена пользователям (${inUse}). Сначала смените им роль.` });
    }
    await role.destroy();
    res.json({ message: 'Роль удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
