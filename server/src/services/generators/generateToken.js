// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

/**
 * Генерация JWT-токена с возможностью указания времени жизни
 * @param {Object} payload - полезные данные (например, userId, role)
 * @param {string|number} expiresIn - срок действия токена (например, '1h', '7d', 3600)
 * @returns {string} - JWT-токен
 */

function generateToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

module.exports = generateToken;
