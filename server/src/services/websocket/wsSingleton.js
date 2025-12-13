//wsSingleton.js
const WebSocketServerClass = require('./websocket-server');

let wsServer = null;

module.exports = {
  // Инициализация при старте приложения
  init: (server) => {
    if (!wsServer) wsServer = new WebSocketServerClass(server);
    return wsServer;
  },
  // Получение экземпляра WS-сервера
  get: () => {
    if (!wsServer) throw new Error('WebSocketServer ещё не инициализирован');
    return wsServer;
  }
};
