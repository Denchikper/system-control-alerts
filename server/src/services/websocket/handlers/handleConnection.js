const logger = require('../../../utils/logger');
const handleMessage = require('./handleMessage');
const handleClose = require('./handleClose');
const handleError = require('./handleError');
const Device = require('../../../models/Devices');
const { remoteHandler } = require('../../remote/remoteHandler');

function normalizeIp(ip) {
  return (ip || '').replace('::ffff:', '');
}

function isLikelyDockerBridgeIp(ip) {
  return /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(ip);
}

module.exports = async (server, ws, req) => {
  const clientIp = normalizeIp(req.socket.remoteAddress);
  ws.isAlive = true;

  ws.on('pong', () => (ws.isAlive = true));

  logger.ws_warn(`Попытка подключения с IP: ${clientIp}`);

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'ping') {
        ws.isAlive = true;
        return;
      }

      if (data.type === 'remoteCommand') {
        remoteHandler(data.receiver_id, data.data);
        return;
      }

      if (data.type === 'error') {
        console.log(data);
        return;
      }

      if (data.type === 'register' && data.nameDevice) {
        let device = await Device.findOne({
          where: { device_name: data.nameDevice, ip_address: clientIp }
        });

        let ipMismatch = false;

        if (!device) {
          device = await Device.findOne({
            where: { device_name: data.nameDevice }
          });

          if (device) {
            ipMismatch = normalizeIp(device.ip_address) !== clientIp;
          }
        }

        if (!device) {
          logger.ws_error(`Устройство "${data.nameDevice}" с IP ${clientIp} не найдено в БД`);
          ws.send(JSON.stringify({ type: 'error', message: 'Device not found' }));
          ws.close();
          return;
        }

        if (ipMismatch && !isLikelyDockerBridgeIp(clientIp)) {
          logger.ws_error(
            `Устройство "${data.nameDevice}" подключается с IP ${clientIp}, но в БД указан ${device.ip_address}`
          );
          ws.send(JSON.stringify({ type: 'error', message: 'Device IP mismatch' }));
          ws.close();
          return;
        }

        if (ipMismatch) {
          logger.ws_warn(
            `IP устройства "${data.nameDevice}" в контейнере виден как ${clientIp}, в БД сохранен ${device.ip_address}. Подключение разрешено по device_name.`
          );
        }

        if (server.devices.has(device.id)) {
          const oldWs = server.devices.get(device.id);
          if (oldWs !== ws) {
            oldWs.terminate();
            logger.ws_warn(`Старое соединение устройства "${device.device_name}" закрыто`);
          }
        }

        server.devices.set(device.id, ws);
        ws.deviceId = device.id;
        ws.deviceName = device.device_name;

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
