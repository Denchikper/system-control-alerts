const ScheduleEvent = require('../../models/ScheduleEvent');

exports.createEvent = async (req, res) => {
  try {
    const { scenario_id, item_order, item_type, start_time, end_time } = req.body;
    const event = await ScheduleEvent.create({ scenario_id, item_order, item_type, start_time, end_time });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventsByScenario = async (req, res) => {
  try {
    const { scenario_id } = req.params;
    const events = await ScheduleEvent.findAll({ where: { scenario_id } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};