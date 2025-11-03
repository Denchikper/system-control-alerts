const Alarm = require('../../models/Alarm');

// Получить все тревоги
exports.getAllAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.findAll({ order: [['id', 'ASC']] });
    res.json(alarms);
  } catch (err) {
    console.error('Ошибка получения тревог:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать тревогу
exports.createAlarm = async (req, res) => {
  try {
    const { name, description, channel, is_drill } = req.body;
    const alarm = await Alarm.create({ name, description, channel, is_drill, is_active: false });
    res.status(201).json(alarm);
  } catch (err) {
    console.error('Ошибка создания тревоги:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить тревогу
exports.updateAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, channel, is_drill} = req.body;

    const alarm = await Alarm.findByPk(id);
    if (!alarm) return res.status(404).json({ message: 'Тревога не найдена' });

    await alarm.update({ name, description, channel, is_drill });
    res.json(alarm);
  } catch (err) {
    console.error('Ошибка обновления тревоги:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить тревогу
exports.deleteAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const alarm = await Alarm.findByPk(id);
    if (!alarm) return res.status(404).json({ message: 'Тревога не найдена' });

    await alarm.destroy();
    res.json({ message: 'Тревога удалена' });
  } catch (err) {
    console.error('Ошибка удаления тревоги:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};