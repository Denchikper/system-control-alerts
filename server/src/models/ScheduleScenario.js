// models/ScheduleScenario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ScheduleScenario = sequelize.define('ScheduleScenario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  schedule_id: { type: DataTypes.INTEGER, allowNull: false },
  day_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'schedule_scenarios',
  timestamps: false,
  indexes: [{ unique: true, fields: ['schedule_id', 'day_id'] }]
});

module.exports = ScheduleScenario;