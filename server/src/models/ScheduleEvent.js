// models/ScheduleEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ScheduleEvent = sequelize.define('ScheduleEvent', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  scenario_id: { type: DataTypes.INTEGER, allowNull: false },
  event_order: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false },
  channel_id: { type: DataTypes.INTEGER, allowNull: false } // ссылка на Channel
}, {
  tableName: 'schedule_events',
  timestamps: false,
  indexes: [{ unique: true, fields: ['scenario_id', 'event_order'] }]
});

module.exports = ScheduleEvent;
