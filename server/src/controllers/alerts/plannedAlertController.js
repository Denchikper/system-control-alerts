const AlertPlanned = require('../../models/AlertPlanned');

exports.getPlannedAlerts = async (req, res) => {
  try {
    const alerts = await AlertPlanned.findAll();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlannedAlert = async (req, res) => {
  try {
    const {
      name, description, event_type, channel,
      start_time, end_time, is_recurring, recurrence_pattern, is_active
    } = req.body;

    const alert = await AlertPlanned.create({
      name, description, event_type, channel,
      start_time, end_time, is_recurring, recurrence_pattern, is_active
    });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};