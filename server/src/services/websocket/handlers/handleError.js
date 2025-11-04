// server/handlers/handleError.js
const logger = require('../../../utils/logger');

module.exports = (server, ws, err) => {
  logger.ws_error('Ошибка WS клиента:', err);
  if (ws === server.device) {
    server.device = null;
    server.deviceName = null;
  }
};
