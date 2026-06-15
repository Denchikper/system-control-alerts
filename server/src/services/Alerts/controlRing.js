const logger = require('../../utils/logger');
const Channel = require('../../models/Channel');
const config = require('../../config');

// Инициирует звонок на реле. Сервер только запускает звонок и передаёт длительность —
// устройство само отсчитывает время и выключает реле (см. прошивку alarmManager).
const controlRing = async (channelId = config.ringChannelId) => {
  try {
    const wsSingleton = require('../websocket/wsSingleton');
    const wsServer = wsSingleton.get();

    const channel = await Channel.findOne({ where: { id: channelId } });

    if (!channel) {
      logger.alertengine_error(`Канал с id ${channelId} не найден`);
      return;
    }

    const sent = wsServer.sendCommandToDevice(
      config.relayDeviceId,
      'activatealarm',
      channel.pin_number,
      { duration: channel.duration }
    );

    if (!sent) {
      logger.alertengine_error(`Устройство не подключено!`);
      return;
    }

    logger.alertengine_success(`Активирован звонок (канал ${channelId}, ${channel.duration} мс)`);
  } catch (err) {
    logger.alertengine_error(`Ошибка при активации канала: ${err.stack || err}`);
  }
};

module.exports = controlRing;
