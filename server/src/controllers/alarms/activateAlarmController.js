const Alarm = require('../../models/Alarm');
const activateAlarm = require('../../services/Alarm/activateAlarm');
const logger = require('../../utils/logger');

exports.activateAlarmController = async (req, res) => {
  const { id } = req.body;

  try {
    const alarm = await Alarm.findOne({ where: { id } });

    if (!alarm) {
      return res.status(404).json({ message: `Тревога №${id} не найдена.` });
    }

    if (alarm.is_active) {
      return res.status(400).json({ message: `Тревога №${id} уже активировна.` });
    }

    activateAlarm(alarm, res);

  } catch (err) {
    logger.error('Ошибка отправления сигнала:', err);
    res.status(500).json({ message: 'Ошибка отправления сигнала' });
  }
};