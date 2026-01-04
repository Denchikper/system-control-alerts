const Schedule = require('../../models/Schedule');

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchedulesActive = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({where: {is_active: true}});
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    const schedule = await Schedule.create({ name, description, is_active });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.activateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const activSchedule = await Schedule.update({ is_active: false }, {where: {is_active: true}});
    if (!activSchedule) return res.status(404).json({ error: 'Schedule not found' });

    const schedule = await Schedule.update({ is_active: true }, {where: {id: id}});
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.update({ name, description, is_active });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};