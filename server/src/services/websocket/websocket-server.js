// server/WebSocketServer.js
const WebSocket = require('ws');
const logger = require('../../utils/logger');
const setupHeartbeat = require('./heartbeat');
const handleConnection = require('./handlers/handleConnection');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.device = null;
    this.deviceName = null;

    // Обрабатываем новые соединения
    this.wss.on('connection', (ws, req) => handleConnection(this, ws, req));
    
    // Настраиваем heartbeat
    setupHeartbeat(this);
  }

  sendCommand(command, channel) {
    if (!this.device || this.device.readyState !== WebSocket.OPEN) return false;
    try {
      const payload = { command };
      if (channel !== undefined) payload.channel = channel;
      this.device.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      logger.ws_error('Не удалось отправить команду на устройство:', err);
      return false;
    }
  }
}

module.exports = WebSocketServer;
