const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../../models/User');
const Role = require('../../models/Role');

const PUBLIC_ATTRS = ['id', 'username', 'first_name', 'second_name', 'last_name', 'role', 'created_at'];

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: PUBLIC_ATTRS, order: [['created_at', 'ASC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, first_name, second_name, last_name, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ error: 'Пользователь с таким логином уже существует' });

    // Роль должна существовать
    const roleName = role || 'user';
    const roleRow = await Role.findOne({ where: { name: roleName } });
    if (!roleRow) return res.status(400).json({ error: `Роль "${roleName}" не найдена` });

    const password_hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await User.create({
      username, password_hash, first_name, second_name, last_name, role: roleName,
    });

    res.status(201).json({
      id: user.id, username: user.username, first_name: user.first_name,
      second_name: user.second_name, last_name: user.last_name, role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    const { first_name, second_name, last_name, role, new_password } = req.body;

    if (role !== undefined) {
      const roleRow = await Role.findOne({ where: { name: role } });
      if (!roleRow) return res.status(400).json({ error: `Роль "${role}" не найдена` });
      user.role = role;
    }
    if (first_name !== undefined) user.first_name = first_name;
    if (second_name !== undefined) user.second_name = second_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (new_password) {
      user.password_hash = await bcrypt.hash(new_password, await bcrypt.genSalt(10));
    }

    await user.save();
    res.json({
      id: user.id, username: user.username, first_name: user.first_name,
      second_name: user.second_name, last_name: user.last_name, role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user && String(req.user.userId) === String(id)) {
      return res.status(400).json({ error: 'Нельзя удалить собственный аккаунт' });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    await user.destroy();
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
