const Alarm = require('../../models/Alarm');
const deactivateAlarm = require('../../services/Alarm/deactivateAlarm');
const logger = require('../../utils/logger');

exports.deactivateAlarmController = async (req, res) => {
  const { id } = req.body;

  try {
    const alarm = await Alarm.findOne({ where: { id } });

    if (!alarm) {
      return res.status(404).json({ message: 'Оповещение не найдено' });
    }

    if (!alarm.is_active) {
      return res.status(400).json({ message: 'Оповещение уже не активно' });
    }

    const channelId = alarm.channel;
    const isTest = alarm.is_test;

    await deactivateAlarm(channelId, isTest);

    alarm.is_active = false;
    await alarm.save();

    logger.info(`Сигнал успешно остановлен на канале ${channelId}`);

    res.json({
      message: 'Сигнал успешно остановлен'
    });

  } catch (err) {
    logger.error('Ошибка при остановке сигнала:', err);
    res.status(500).json({ message: 'Ошибка при остановке сигнала' });
  }
};
