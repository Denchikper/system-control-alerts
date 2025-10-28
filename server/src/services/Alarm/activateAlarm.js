const wsSingleton = require('../websocket/wsSingleton');
const logger = require('../../utils/logger');
const Channel = require('../../models/Channel');
const deactivateAlarm = require('./deactivateAlarm');

const activateAlarm = async (alarm, res) => {
  try {
    await deactivateAlarm();

    const wsServer = wsSingleton.get();


    const channel = await Channel.findOne({ where: { id: alarm.channel } });
    if (!channel) {
      logger.ws_error(`Канал с id ${alarm.channel} не найден`);
      return res.status(404).json({ message: `Канал с id ${alarm.channel} не найден` });
    }

    let sent = false;

    if (alarm.is_drill) {
      const drillChannel = await Channel.findOne({ where: { is_drill: true } });
      
      if (!drillChannel) {
        logger.ws_error('Канал для включения тренировки не найден');
        return res.status(404).json({ message: 'Канал для включения тренировки не найден' });
      }

      sent = wsServer.sendCommand('activatealarm', [drillChannel.pin_number, drillChannel.duration, channel.pin_number, channel.duration]);
      if (!sent) {
        logger.ws_error(`Не удалось активировать тревогу №${alarm.id} (${alarm.name} | Учебная тренировка) — устройство не подключено`);
        return res.status(500).json({ message: `Не удалось активировать тревогу №${alarm.id} (${alarm.name} | Учебная тренировка) — устройство не подключено` });
      }

      logger.ws_success(`Активирована тревога №${alarm.id} (${alarm.name}) (тренировочный режим)`);
      alarm.is_active = true;
      await alarm.save();
      return res.json({ message: `Активирована тревога №${alarm.id} (${alarm.name}) (тренировочный режим)` });
    }

    // === Обычный режим ===
    sent = wsServer.sendCommand('activatealarm', channel.pin_number);
    if (!sent) {
      logger.ws_error(`Не удалось активировать тревогу №${alarm.id} (${alarm.name}) — устройство не подключено`);
      return res.status(500).json({ message: `Не удалось активировать тревогу №${alarm.id} (${alarm.name}) — устройство не подключено` });
    }

    logger.ws_success(`Активирована тревога №${alarm.id} (${alarm.name}) (обычный режим)`);
    alarm.is_active = true;
    await alarm.save();

    return res.json({ message: `Активирована тревога №${alarm.id} (${alarm.name}) (обычный режим)` });

  } catch (err) {
    logger.ws_error(`Ошибка при активации канала: ${err.stack || err}`);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Ошибка при активации канала', error: err.message || err });
    }
  }
};

module.exports = activateAlarm;
