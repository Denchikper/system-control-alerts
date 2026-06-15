const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateToken = require('../../services/generators/generateToken');
const logger = require('../../utils/logger');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const ip = req.ip || req.socket?.remoteAddress || null;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      logger.audit('Неудачный вход', { username, ip, meta: { reason: 'user_not_found' } });
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logger.audit('Неудачный вход', { username, ip, meta: { reason: 'bad_password' } });
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    logger.audit('Вход в систему', { username: user.username, ip });

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