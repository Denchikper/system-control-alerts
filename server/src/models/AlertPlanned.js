const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AlertPlanned = sequelize.define('AlertPlanned', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  target_type: { type: DataTypes.ENUM('channel', 'alarm'), allowNull: false },
  target_id: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  recurrence: { type: DataTypes.ENUM('once', 'daily', 'weekly', 'monthly'), defaultValue: 'once' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'alerts_planned',
  timestamps: false
});

module.exports = AlertPlanned;