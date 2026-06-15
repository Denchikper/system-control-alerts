const config = require('../../config');

module.exports = function setupHeartbeat(server) {
  const interval = config.wsHeartbeatInterval;

  setInterval(() => {
    for (const ws of server.wss.clients) {
      if (!ws.isAlive) {
        ws.terminate();
      } else {
        ws.isAlive = false;
        ws.ping();
      }
    }
  }, interval);
};