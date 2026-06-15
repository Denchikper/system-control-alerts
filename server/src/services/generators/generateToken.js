// src/utils/generateToken.js
const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Генерация JWT-токена с возможностью указания времени жизни
 * @param {Object} payload - полезные данные (например, userId, role)
 * @param {string|number} [expiresIn] - срок действия токена (по умолчанию config.jwtExpiresIn)
 * @returns {string} - JWT-токен
 */

function generateToken(payload, expiresIn = config.jwtExpiresIn) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

module.exports = generateToken;
