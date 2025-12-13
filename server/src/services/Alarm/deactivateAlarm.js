const wsSingleton = require('../websocket/wsSingleton');
const logger = require('../../utils/logger');
const Alarm = require('../../models/Alarm');

const DEVICE_ID = 'a41942b7-4f77-4b13-90d5-da88294125f1'; // конкретное устройство

const deactivateAlarm = async (res) => {
  try {
    const wsServer = wsSingleton.get();

    // Получаем активную тревогу
    const activeAlarm = await Alarm.findOne({ where: { is_active: true } });

    if (!activeAlarm) {
      const msg = 'Нет активной тревоги для деактивации';
      logger.ws_warn(msg);
      if (res) return res.status(400).json({ errorMessage: msg });
      return false;
    }

    // Отправляем команду deactivate на конкретное устройство
    const sent = wsServer.sendCommandToDevice(DEVICE_ID, 'deactivatealarm');

    if (!sent) {
      const msg = 'Не удалось отправить команду деактивации — устройство не подключено';
      logger.ws_error(msg);
      if (res) return res.status(503).json({ errorMessage: msg });
      return false;
    }

    activeAlarm.is_active = false;
    await activeAlarm.save();

    logger.ws_success(`Деактивирована тревога: №${activeAlarm.id} (${activeAlarm.name})`);

    if (res) return res.json({ message: `Деактивирована тревога: №${activeAlarm.id} (${activeAlarm.name})` });

    return true;

  } catch (err) {
    const msg = `Ошибка при деактивации тревоги: ${err.stack || err}`;
    logger.ws_error(msg);
    if (res) return res.status(500).json({ errorMessage: msg });
    return false;
  }
};

module.exports = deactivateAlarm;