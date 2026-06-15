const { Op } = require('sequelize');
const Log = require('../models/Log');
const logger = require('./logger');
const config = require('../config');

const DAY_MS = 24 * 60 * 60 * 1000;

// Удаляет записи журнала старше logRetentionDays.
async function purgeOldLogs() {
  try {
    const cutoff = new Date(Date.now() - config.logRetentionDays * DAY_MS);
    const deleted = await Log.destroy({ where: { created_at: { [Op.lt]: cutoff } } });
    if (deleted > 0) {
      logger.db_success(`Очистка журнала: удалено записей старше ${config.logRetentionDays} дн. — ${deleted}`);
    }
  } catch (err) {
    logger.db_error(`Ошибка очистки журнала: ${err.message}`);
  }
}

// Запускает очистку сразу и раз в сутки.
function startLogRetention() {
  purgeOldLogs();
  setInterval(purgeOldLogs, DAY_MS);
}

module.exports = { startLogRetention, purgeOldLogs };
