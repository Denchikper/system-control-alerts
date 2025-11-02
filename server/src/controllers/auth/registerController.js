const { Op } = require('sequelize');  
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateToken = require('../../services/generators/generateToken');
const logger = require('../../utils/logger');

exports.register = async (req, res) => {
  const { 
    username, 
    password, 
    first_name,
    last_name,
    role,
  } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь с таким username уже существует' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password_hash,
      first_name,
      last_name,
      role
    });
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован'});

  } catch (error) {
    logger.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};