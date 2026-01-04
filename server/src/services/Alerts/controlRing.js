const logger = require('../../utils/logger');
const Channel = require('../../models/Channel');

const DEVICE_ID = 'a41942b7-4f77-4b13-90d5-da88294125f1';


const controlRing = async (data) => {
  try {
    const wsSingleton = require('../websocket/wsSingleton');
    const wsServer = wsSingleton.get();

      const channel = await Channel.findOne({ where: { id: 6 } });

      if (!channel) {
        logger.alertengine_error(`Канал с id ${alarm.channel} не найден`);
        return
      }

      let sent = false;

      sent = wsServer.sendCommandToDevice(DEVICE_ID, 'activatealarm', channel.pin_number);

      if (!sent) {
        logger.alertengine_error(`Не удалось активировать тревогу №${alarm.id} (${alarm.name}) — устройство не подключено`);
        return
      }

      logger.alertengine_success(`Активирован звонок`);

      setTimeout(() => {
        wsServer.sendCommandToDevice(DEVICE_ID, 'deactivatealarm');
        logger.alertengine_success(`Деактивирован звонок`);
      }, channel.duration);

      return

    } catch (err) {
      logger.alertengine_error(`Ошибка при активации канала: ${err.stack || err}`);
    }
};

module.exports = controlRing;