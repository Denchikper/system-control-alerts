const e = require('express');
const ScheduleEvent = require('../../models/ScheduleEvent');

exports.createEvent = async (req, res) => {
  try {
    const { scenario_id, event_order, start_time, end_time } = req.body;
    const event = await ScheduleEvent.create({ scenario_id, event_order, start_time, end_time, channel_id: 6 });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEventsByID = async (req, res) => {
  try {
    const { event_id } = req.params;
    const event = await ScheduleEvent.findByPk(event_id);
    if (!event) return res.status(404).json({ message: 'Тревога не найдена' });
    await event.destroy();
    res.status(200).json({ message: 'Успешно удалено' });
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