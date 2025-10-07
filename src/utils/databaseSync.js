const sequelize = require('../database');
const logger = require('./logger');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    logger.info('✅ База данных синхронизирована успешно!');
  } catch (err) {
    logger.error('❌ Ошибка при синхронизации базы данных:', err);
    throw err;
  }
}

module.exports = { syncDatabase };