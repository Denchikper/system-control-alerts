const logger = require('../../../utils/logger');
const Alarm = require('../../../models/Alarm');
const config = require('../../../config');

const DEVICE_ID = config.relayDeviceId; // целевое реле из конфига

const deactivateAlarmRemote = async () => {
  try {
    const wsSingleton = require('../../websocket/wsSingleton');
    
    const wsServer = wsSingleton.get();


    const activeAlarm = await Alarm.findOne({ where: { is_active: true } });

    if (!activeAlarm) {
      const msg = 'Нет активной тревоги для деактивации';
      logger.remote_warn(msg);
      return false;
    }

    // Отправляем команду deactivate на конкретное устройство
    const sent = wsServer.sendCommandToDevice(DEVICE_ID, 'deactivatealarm');

    if (!sent) {
      const msg = 'Не удалось отправить команду деактивации — устройство не подключено';
      logger.remote_error(msg);
      return false;
    }

    activeAlarm.is_active = false;
    await activeAlarm.save();

    logger.remote_success(`Деактивирована тревога: №${activeAlarm.id} (${activeAlarm.name})`);

    return true;

  } catch (err) {
    const msg = `Ошибка при деактивации тревоги: ${err.stack || err}`;
    logger.remote_error(msg);
    return false;
  }
};

module.exports = deactivateAlarmRemote;