const AlertPlanned = require('../../models/AlertPlanned');

exports.getPlannedAlerts = async (req, res) => {
  try {
    const alerts = await AlertPlanned.findAll({ order: [['start_time', 'ASC']] });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlannedAlert = async (req, res) => {
  try {
    const { name, target_type, target_id, start_time, recurrence, is_active } = req.body;

    if (!name || !target_type || target_id === undefined || !start_time) {
      return res.status(400).json({ error: 'Не заполнены обязательные поля (name, target_type, target_id, start_time)' });
    }

    const alert = await AlertPlanned.create({
      name,
      target_type,
      target_id,
      start_time,
      recurrence,
      is_active,
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlannedAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertPlanned.findByPk(id);
    if (!alert) return res.status(404).json({ error: 'Оповещение не найдено' });

    const { name, target_type, target_id, start_time, recurrence, is_active } = req.body;

    if (name !== undefined) alert.name = name;
    if (target_type !== undefined) alert.target_type = target_type;
    if (target_id !== undefined) alert.target_id = target_id;
    if (start_time !== undefined) alert.start_time = start_time;
    if (recurrence !== undefined) alert.recurrence = recurrence;
    if (is_active !== undefined) alert.is_active = is_active;
    alert.updated_at = new Date();

    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.togglePlannedAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertPlanned.findByPk(id);
    if (!alert) return res.status(404).json({ error: 'Оповещение не найдено' });

    alert.is_active = !alert.is_active;
    alert.updated_at = new Date();
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlannedAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertPlanned.findByPk(id);
    if (!alert) return res.status(404).json({ error: 'Оповещение не найдено' });

    await alert.destroy();
    res.json({ message: 'Оповещение удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
