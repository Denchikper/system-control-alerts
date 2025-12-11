module.exports = function setupHeartbeat(server) {
  const interval = parseInt(process.env.WS_HEARTBEAT_DEVICES_INTERVAL) || 30000;

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