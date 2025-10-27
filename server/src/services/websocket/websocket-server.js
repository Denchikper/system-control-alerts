const WebSocket = require('ws');
const logger = require('../../utils/logger');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.devices = new Map(); // channelId => ws-соединение

    this.wss.on('connection', (ws, req) => {
      logger.info(`🔗 Новый клиент подключился: ${req.socket.remoteAddress}`);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);

          // Регистрация устройства
          if (data.type === 'register' && data.channelId) {
            this.devices.set(data.channelId, ws);
            ws.channelId = data.channelId;
            logger.info(`✅ Устройство зарегистрировано: канал ${data.channelId}`);
            return;
          }

          logger.info('📩 Сообщение от клиента:', data);

        } catch (err) {
          logger.error('❌ Ошибка обработки сообщения:', err);
        }
      });

      ws.on('close', () => {
        if (ws.channelId) {
          this.devices.delete(ws.channelId);
          logger.info(`❌ Устройство отключилось: канал ${ws.channelId}`);
        }
      });

      ws.on('error', (err) => {
        logger.error('⚠️ Ошибка WS клиента:', err);
        if (ws.channelId) this.devices.delete(ws.channelId);
      });
    });
  }

  sendCommand(channelId, command) {
    const device = this.devices.get(channelId);
    if (!device || device.readyState !== WebSocket.OPEN) {
      logger.warn(`⚠️ Устройство с каналом ${channelId} не подключено`);
      return false;
    }

    const payload = { command, channelId };
    device.send(JSON.stringify(payload));
    return true;
  }

  broadcast(command) {
    for (const [channelId, device] of this.devices.entries()) {
      if (device.readyState === WebSocket.OPEN) {
        device.send(JSON.stringify({ command, channelId }));
      }
    }
    logger.info(`📡 Команда "${command}" отправлена всем устройствам`);
  }
}

module.exports = WebSocketServer;
