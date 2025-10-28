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

          if(data.type === 'ping') {ws.isAlive = true; return;}

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

      ws.isAlive = true;

const HEARTBEAT_INTERVAL = 10000000;

this.wss.on('connection', (ws) => {
  ws.isAlive = true;

  ws.on('pong', () => ws.isAlive = true);

});

// Таймер проверки "живости" клиентов
setInterval(() => {
  this.wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log('Клиент потерян, закрываем соединение');
      ws.terminate();
      if (ws === this.device) {
        this.device = null;
        this.deviceName = null;
      }
    } else {
      ws.isAlive = false;
      ws.ping(); // сервер отправляет ping, клиент должен ответить pong
    }
  });
}, HEARTBEAT_INTERVAL);

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
