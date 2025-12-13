const logger = require('../../../utils/logger');
const Device = require('../../../models/Devices');

module.exports = async (server, ws) => {
  try {
    if (ws.deviceId && server.devices.has(ws.deviceId)) {
      // Удаляем устройство из Map
      server.devices.delete(ws.deviceId);

      const dbDevice = await Device.findByPk(ws.deviceId);
      if (dbDevice) {
        dbDevice.is_online = false;
        await dbDevice.save();
        logger.ws_success(`Статус "${dbDevice.device_name}" обновлён на offline.`);
      }

      logger.ws_success(`Устройство "${ws.deviceName}" отключилось.`);
    }
  } catch (err) {
    logger.ws_error('Ошибка при обновлении статуса offline:', err);
  }
};