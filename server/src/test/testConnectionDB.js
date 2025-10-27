const sequelize = require('../database');
const logger = require('../utils/logger');

async function testConnectionDB() {
  try {
    await sequelize.authenticate();
    logger.db_success('Соединение с базой установлено успешно!');
  } catch (error) {
    logger.db_error('Не удалось подключиться к базе:', error);
  }
}

module.exports = { testConnectionDB };