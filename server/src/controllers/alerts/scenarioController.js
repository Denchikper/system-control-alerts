const ScheduleScenario = require('../../models/ScheduleScenario');
const ScheduleEvent = require('../../models/ScheduleEvent');
const Day = require('../../models/Day');

exports.getScenarios = async (req, res) => {
  const { schedule_id } = req.params;
  try {
    const scenarios = await ScheduleScenario.findAll({ 
      where: { schedule_id: schedule_id },
      include: [
        { model: ScheduleEvent, as: 'ScheduleEvents' },
        { model: Day }
      ]
    });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createScenario = async (req, res) => {
  try {
    const { schedule_id, day_id } = req.body;
    const scenario = await ScheduleScenario.create({ schedule_id, day_id });
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};