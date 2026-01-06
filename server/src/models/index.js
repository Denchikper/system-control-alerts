const Schedule = require('./Schedule');
const Day = require('./Day');
const ScheduleScenario = require('./ScheduleScenario');
const ScheduleEvent = require('./ScheduleEvent');
const Channel = require('./Channel');
const AlertPlanned = require('./AlertPlanned');

require('./User');
require('./Devices');
require("./Channel")
require('./Alarm');

Schedule.hasMany(ScheduleScenario, { foreignKey: 'schedule_id' });
ScheduleScenario.belongsTo(Schedule, { foreignKey: 'schedule_id' });

// День → сценарий
Day.hasMany(ScheduleScenario, { foreignKey: 'day_id' });
ScheduleScenario.belongsTo(Day, { foreignKey: 'day_id' });

// Сценарий → события
ScheduleScenario.hasMany(ScheduleEvent, { foreignKey: 'scenario_id' });
ScheduleEvent.belongsTo(ScheduleScenario, { foreignKey: 'scenario_id' });

// Канал → события
Channel.hasMany(ScheduleEvent, { foreignKey: 'channel_id' });
ScheduleEvent.belongsTo(Channel, { foreignKey: 'channel_id' });
