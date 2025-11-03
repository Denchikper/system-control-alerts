const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateToken = require('../../services/generators/generateToken');
const logger = require('../../utils/logger');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const token = generateToken({ 
      userId: user.id, 
      username: user.username,
      firstName: user.first_name,
      secondName: user.second_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at
    }, '2h');

    res.json({
      token
    });
  } catch (err) {
    logger.error('Ошибка авторизации:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};