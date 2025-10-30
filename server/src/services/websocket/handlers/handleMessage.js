// server/handlers/handleMessage.js
const logger = require('../../../utils/logger');

module.exports = (server, ws, message) => {
  try {
    // Если сообщение уже объект (parse делается в handleConnection)
    const data = typeof message === 'string' ? JSON.parse(message) : message;

    if (data.type === 'ping') {
      ws.isAlive = true;
      return;
    }

    // Любые другие сообщения — логируем и обрабатываем
    logger.ws_success('Сообщение от клиента:', data);

    // Здесь можно направлять команды дальше по приложению
  } catch (err) {
    logger.ws_error('Ошибка обработки сообщения:', err);
  }
};
