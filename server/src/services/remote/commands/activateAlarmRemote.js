const logger = require('../../../utils/logger');
const Channel = require('../../../models/Channel');
const deactivateAlarmRemote = require('./deactivateAlarmRemote');
const Alarm = require('../../../models/Alarm');
const { checkDutyCode } = require('../checkDutyCode');

const DEVICE_ID = 'a41942b7-4f77-4b13-90d5-da88294125f1'; // конкретное устройство

var isTrain = false

const activateAlarmRemote = async (data) => {
  try {
    const isCodeCorrect = await checkDutyCode(data.code)
    if (isCodeCorrect) {
      const wsSingleton = require('../../websocket/wsSingleton');

      const activeAlarm = await Alarm.findOne({ where: { is_active: true } });
      if (activeAlarm) {
        await deactivateAlarmRemote();
      }

      const wsServer = wsSingleton.get();

      switch (data.typeAlarm) {
          case "trevoga":
              isTrain = false
              break;
          case "trenirovka":
              isTrain = true
              break;
          default:
              break;
      }

      const alarm = await Alarm.findOne({ where: { name_remote: data.alarm, is_drill: isTrain } });

      const channel = await Channel.findOne({ where: { id: alarm.channel } });

      if (!channel) {
        logger.remote_error(`Канал с id ${alarm.channel} не найден`);
        return
      }

      let sent = false;

      if (isTrain) {
        const drillChannel = await Channel.findOne({ where: { is_drill: true } });
        if (!drillChannel) {
          logger.remote_error('Канал для включения тренировки не найден');
          return
        }

        sent = wsServer.sendCommandToDevice(
          DEVICE_ID,
          'activatealarm',
          [drillChannel.pin_number, drillChannel.duration, channel.pin_number, channel.duration]
        );

        if (!sent) {
          logger.remote_error(`Не удалось активировать тревогу №${alarm.id} (${alarm.name} | Учебная тренировка) — устройство не подключено`);
          return
        }

        logger.remote_success(`Активирована тревога №${alarm.id} (${alarm.name}) (тренировочный режим)`);
        alarm.is_active = true;

        await alarm.save();
        return
      }

      // === Обычный режим ===
      sent = wsServer.sendCommandToDevice(DEVICE_ID, 'activatealarm', channel.pin_number);

      if (!sent) {
        logger.remote_error(`Не удалось активировать тревогу №${alarm.id} (${alarm.name}) — устройство не подключено`);
        return
      }

      logger.remote_success(`Активирована тревога №${alarm.id} (${alarm.name}) (обычный режим)`);
      alarm.is_active = true;
      await alarm.save();

      return

    } else {
      logger.remote_error(`Неверный код.`);
    } 
    } catch (err) {
      logger.remote_error(`Ошибка при активации канала: ${err.stack || err}`);
    }
};

module.exports = activateAlarmRemote;