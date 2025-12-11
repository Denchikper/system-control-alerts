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

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);

      // Ping для heartbeat
      if (data.type === 'ping') {
        ws.isAlive = true;
        return;
      }

      if (data.type === 'remoteCommand') {
        console.log(data.data)
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

        // Проверяем, если уже есть такое устройство
        if (server.devices.has(device.id)) {
          const oldWs = server.devices.get(device.id);
          if (oldWs !== ws) {
            oldWs.terminate(); // Закрываем старое соединение
            logger.ws_warn(`Старое соединение устройства "${device.device_name}" закрыто`);
          }
        }

        // Добавляем или обновляем устройство
        server.devices.set(device.id, ws);
        ws.deviceId = device.id;
        ws.deviceName = device.device_name;

        // Обновляем статус в БД
        device.is_online = true;
        await device.save();

        logger.ws_success(`Устройство "${device.device_name}" (${clientIp}) подключено.`);
        ws.send(JSON.stringify({ type: 'registered' }));
        return;
      }

      handleMessage(server, ws, data);

    } catch (err) {
      logger.ws_error('Ошибка при обработке сообщения:', err);
      ws.close();
    }
  });

  ws.on('close', () => handleClose(server, ws));
  ws.on('error', (err) => handleError(server, ws, err));
};