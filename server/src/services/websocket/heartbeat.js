module.exports = function setupHeartbeat(server) {
  const interval = process.env.WS_HEARTBEAT_DEVICES_INTERVAL;

  setInterval(async () => {
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
