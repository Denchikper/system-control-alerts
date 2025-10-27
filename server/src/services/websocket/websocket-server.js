const WebSocket = require('ws');
const logger = require('../../utils/logger');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.device = null;
    this.deviceName = null;

    this.wss.on('connection', (ws, req) => {
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);

          if (data.type === 'register' && data.nameDevice) {
            this.device = ws;
            this.deviceName = data.nameDevice;
            logger.ws_success(`Устройство "${data.nameDevice}" зарегистрировано`);
            return;
          }

          logger.ws_success('Сообщение от клиента:', data);
        } catch (err) {
          logger.ws_error('Ошибка обработки сообщения:', err);
        }
      });

      ws.on('close', () => {
        if (ws === this.device) {
          logger.ws_success(`Устройство "${this.deviceName}" отключилось`);
          this.device = null;
          this.deviceName = null;
        }
      });

      ws.on('error', (err) => {
        logger.ws_error('Ошибка WS клиента:', err);
        if (ws === this.device) {
          this.device = null;
          this.deviceName = null;
        }
      });
    });
  }

  // -----------------------------
  // Отправка команды на устройство
  // -----------------------------
  sendCommand(command, channel) {
    if (!this.device || this.device.readyState !== WebSocket.OPEN) {
      return false;
    }

    const payload = { command, channel };
    this.device.send(JSON.stringify(payload));
    return true;
  }
}

module.exports = WebSocketServer;
