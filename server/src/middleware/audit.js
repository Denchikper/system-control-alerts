const logger = require('../utils/logger');

// Логирует изменяющие запросы (POST/PUT/PATCH/DELETE) в таблицу logs.
// GET и логин не логируем здесь (логин — отдельно в контроллере, GET слишком шумные).
module.exports = function auditMiddleware(req, res, next) {
  const method = req.method;
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  if (req.originalUrl.includes('/auth/login')) return next();

  res.on('finish', () => {
    logger.audit(`${method} ${req.originalUrl}`, {
      username: req.user?.username || null,
      ip: req.ip || req.socket?.remoteAddress || null,
      meta: { status: res.statusCode, method, path: req.originalUrl },
    });
  });

  next();
};
