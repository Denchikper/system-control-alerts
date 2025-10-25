const sequelize = require('../database');
const logger = require('../utils/logger');

async function testConnectionDB() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Соединение с базой установлено успешно!');
  } catch (error) {
    logger.error('❌ Не удалось подключиться к базе:', error);
  }
}

module.exports = { testConnectionDB };