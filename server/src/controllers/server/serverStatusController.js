// server/controllers/serverStatusController.js
const Device = require('../../models/Devices');
const Alarm = require('../../models/Alarm');
// const Alert = require('../../models/Alerts');

exports.serverStatusController = async (req, res) => {
  try {
    // Считаем все устройства
    const devicesList = await Device.findAll({order: [['id', 'ASC']]});
    // Активные тревоги
    const activeAlarm = await Alarm.findOne({ where: { is_active: true } });
    // Активные оповещения
    // const activeAlerts = await Alert.count({ where: { is_active: true } });

    res.status(200).json({
      devicesList,
      activeAlarm
    });
  } catch (err) {
    console.error("Ошибка при получении статуса системы:", err);
    res.status(500).json({ message: "Не удалось получить статус системы" });
  }
};
