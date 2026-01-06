const sequelize = require('../../database');
const Day = require('../../models/Day');
const Schedule = require('../../models/Schedule');
const ScheduleEvent = require('../../models/ScheduleEvent');
const ScheduleScenario = require('../../models/ScheduleScenario');

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

exports.deleteSchedules = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id, { transaction });
    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Расписание не найдено' });
    }

    const scenarios = await ScheduleScenario.findAll({
      where: { schedule_id: id },
      transaction
    });

    for (const scenario of scenarios) {
      await ScheduleEvent.destroy({
        where: { scenario_id: scenario.id },
        transaction
      });
    }

    await ScheduleScenario.destroy({
      where: { schedule_id: id },
      transaction
    });

    await schedule.destroy({ transaction });
    
    await transaction.commit();
    res.status(200).json({ 
      message: 'Расписание, связанные сценарии и события успешно удалены' 
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Название расписания обязательно' });
    }
    const schedule = await Schedule.create({ name });
    const days = await Day.findAll({
      order: [['order_index', 'ASC']]
    });

    const scenarios = days.map(day => ({
      schedule_id: schedule.id,
      day_id: day.id
    }));

    await ScheduleScenario.bulkCreate(scenarios);
    res.json({
      schedule,
      scenarios_created: scenarios.length
    });
  } catch (err) {
    console.error('createSchedule error:', err);
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
    const { name, is_active } = req.body;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.update({ name, is_active });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};