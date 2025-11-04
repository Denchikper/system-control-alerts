const wsSingleton = require('../websocket/wsSingleton');
const logger = require('../../utils/logger');
const Alarm = require('../../models/Alarm');

const deactivateAlarm = async (res) => {
  try {
    const wsServer = wsSingleton.get();

    // Получаем все активные тревоги
    const activeAlarm = await Alarm.findOne({ where: { is_active: true } });

    if (!activeAlarm) {
      const msg = 'Нет активной тревоги для деактивации';
      logger.ws_warn(msg);
      if (res) return res.status(400).json({ errorMessage: msg });
      return false;
    }

    // Отправляем команду deactivate на устройство без указания пинов
    const sent = wsServer.sendCommand('deactivatealarm');

    if (!sent) {
      const msg = 'Не удалось отправить команду деактивации — устройство не подключено';
      logger.ws_error(msg);
      if (res) return res.status(503).json({ errorMessage: msg });
      return false;
    }

    activeAlarm.is_active = false;
    activeAlarm.save();

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
