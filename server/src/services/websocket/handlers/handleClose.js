const logger = require('../../../utils/logger');
const Device = require('../../../models/Devices'); // подключаем модель напрямую

module.exports = async (server, ws, device) => {
  try {
    // Очищаем ссылки
    if (ws === server.device) {
      logger.ws_success(`Устройство "${server.deviceName}" отключилось.`);
      server.device = null;
      server.deviceName = null;
    }

    // Ищем device по ws.deviceId
    if (ws.deviceId) {
      const dbDevice = await Device.findByPk(ws.deviceId);
      if (dbDevice) {
        dbDevice.is_online = false;
        await dbDevice.save();
        logger.ws_success(`Статус "${dbDevice.device_name}" обновлён на offline.`);
      }
    }
  } catch (err) {
    logger.ws_error('Ошибка при обновлении статуса offline:', err);
  }
};
