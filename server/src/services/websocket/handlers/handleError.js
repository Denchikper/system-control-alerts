const logger = require('../../../utils/logger');

module.exports = (server, ws, err) => {
  logger.ws_error('Ошибка WS клиента:');
  console.log(err)

  if (ws.deviceId) {
    // Удаляем из Map устройств при ошибке
    server.devices.delete(ws.deviceId);
    ws.deviceId = null;
    ws.deviceName = null;
  }
};