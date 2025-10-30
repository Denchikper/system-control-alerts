// server/handlers/handleConnection.js
const logger = require('../../../utils/logger');
const handleMessage = require('./handleMessage');
const handleClose = require('./handleClose');
const handleError = require('./handleError');
const Device = require('../../../models/Devices');

module.exports = async (server, ws, req) => {
  const clientIp = req.socket.remoteAddress.replace('::ffff:', '');
  ws.isAlive = true;

  ws.on('pong', () => (ws.isAlive = true));

  logger.ws_warn(`Попытка подключения с IP: ${clientIp}`);

  // Обрабатываем все сообщения
  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);

      // Ping для heartbeat
      if (data.type === 'ping') {
        ws.isAlive = true;
        return;
      }

      // Регистрация устройства
      if (data.type === 'register' && data.nameDevice) {
        const device = await Device.findOne({
          where: { device_name: data.nameDevice, ip_address: clientIp }
        });

        if (!device) {
          logger.ws_error(`Устройство "${data.nameDevice}" с IP ${clientIp} не найдено в БД!`);
          ws.send(JSON.stringify({ type: 'error', message: 'Device not found or IP mismatch' }));
          ws.close();
          return;
        }

        device.is_online = true;
        await device.save();

        server.device = ws;
        server.deviceName = data.nameDevice;
        ws.deviceName = data.nameDevice;
        ws.deviceId = device.id;

        logger.ws_success(`Устройство "${data.nameDevice}" (${clientIp}) подключено.`);
        ws.send(JSON.stringify({ type: 'registered' }));
        return;
      }

      // Любые другие сообщения после регистрации
      handleMessage(server, ws, data);

    } catch (err) {
      logger.ws_error('Ошибка при обработке сообщения:', err);
      ws.close();
    }
  });

  ws.on('close', () => handleClose(server, ws));  // вызываем наш handleClose
  ws.on('error', (err) => handleError(server, ws, err));  // вызываем handleError
};
