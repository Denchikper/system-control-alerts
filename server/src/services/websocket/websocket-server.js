const WebSocket = require('ws');
const logger = require('../../utils/logger');
const setupHeartbeat = require('./heartbeat');
const handleConnection = require('./handlers/handleConnection');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });

    // Храним все устройства: key = deviceId, value = ws
    this.devices = new Map();

    // Обрабатываем новые соединения
    this.wss.on('connection', (ws, req) => handleConnection(this, ws, req));
    
    // Настраиваем heartbeat
    setupHeartbeat(this);
  }

  // Отправка команды одному устройству
  sendCommandToDevice(deviceId, command, channel) {
    const ws = this.devices.get(deviceId);
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      const payload = { command };
      if (channel !== undefined) payload.channel = channel;
      ws.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      logger.ws_error(`Не удалось отправить команду устройству ${deviceId}:`, err);
      return false;
    }
  }

  // Рассылка команды всем устройствам
  broadcastCommand(command, channel) {
    const payload = { command };
    if (channel !== undefined) payload.channel = channel;

    for (const ws of this.devices.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(payload));
        } catch (err) {
          logger.ws_error('Ошибка при отправке команды:', err);
        }
      }
    }
  }
}

module.exports = WebSocketServer;