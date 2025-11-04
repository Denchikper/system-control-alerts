const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AlertPlanned = sequelize.define('AlertPlanned', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  event_type: {
    type: DataTypes.ENUM('lesson', 'break', 'special'),
    allowNull: false,
    defaultValue: 'special'
  },
  channel: {
    type: DataTypes.INTEGER
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurrence_pattern: {
    type: DataTypes.STRING(50) // 'daily', 'weekly', 'monthly'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'alerts_planned',
  timestamps: false
});

module.exports = AlertPlanned;