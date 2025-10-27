const Alarm = require('../../models/Alarm');
const activateAlarm = require('../../services/Alarm/activateAlarm');
const logger = require('../../utils/logger');

exports.activateAlarmController = async (req, res) => {
  const { id } = req.body;

  try {
    const alarm = await Alarm.findOne({ where: { id } });

    if (!alarm) {
      return res.status(404).json({ message: 'Оповещение не найдено' });
    }

    if (alarm.is_active) {
      return res.status(400).json({ message: 'Оповещение уже активно' });
    }

    const channelId = alarm.channel;
    const isTest = alarm.is_test;

    await activateAlarm(channelId, isTest);

    alarm.is_active = true;
    await alarm.save();

    logger.info(`Сигнал успешно отправлен на канал ${channelId}`);
    res.json({
      message: 'Сигнал успешно отправлен'
    });

  } catch (err) {
    logger.error('Ошибка отправления сигнала:', err);
    res.status(500).json({ message: 'Ошибка отправления сигнала' });
  }
};
