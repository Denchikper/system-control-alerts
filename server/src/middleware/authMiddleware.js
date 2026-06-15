const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const config = require('../config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }

  const token = authHeader.split(' ')[1]; // формат: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    req.user = decoded; // положим данные пользователя в req
    next();
  } catch (err) {
    logger.error('Ошибка авторизации:', err);
    return res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
}

module.exports = authMiddleware;