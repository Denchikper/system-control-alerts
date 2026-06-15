const crypto = require('crypto');
const sequelize = require('../database');
const logger = require('./logger');
const Device = require('../models/Devices');
const { seedDatabase } = require('./seed');

function generateDeviceToken() {
  return crypto.randomBytes(24).toString('hex');
}

// Выдаёт auth_token устройствам, у которых его ещё нет, и логирует выданные значения,
// чтобы оператор мог прошить их в железо.
async function backfillDeviceTokens() {
  const devices = await Device.findAll({ where: { auth_token: null } });
  for (const device of devices) {
    device.auth_token = generateDeviceToken();
    await device.save();
    logger.db_warn(`Устройству "${device.device_name}" выдан auth_token: ${device.auth_token}`);
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    logger.db_success('База данных синхронизирована успешно!');
    await backfillDeviceTokens();
    await seedDatabase();
  } catch (err) {
    logger.db_error('Ошибка при синхронизации базы данных:', err);
    throw err;
  }
}

module.exports = { syncDatabase, generateDeviceToken };
