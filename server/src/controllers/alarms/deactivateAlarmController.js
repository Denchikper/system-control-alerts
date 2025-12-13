const deactivateAlarm = require('../../services/Alarm/deactivateAlarm');
const deactivateAlarmRemote = require('../../services/remote/commands/deactivateAlarmRemote');
const logger = require('../../utils/logger');

exports.deactivateAlarmController = async (req, res) => {

  try {
    deactivateAlarm(res);

  } catch (err) {
    logger.error('Ошибка при остановке сигнала:', err);
    res.status(500).json({ message: 'Ошибка при остановке сигнала' });
  }
};