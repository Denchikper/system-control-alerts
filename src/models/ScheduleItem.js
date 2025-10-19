const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ScheduleItem = sequelize.define('ScheduleItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  day_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_type: {
    type: DataTypes.ENUM('lesson', 'break'),
    allowNull: false
  },
  lesson_id: {
    type: DataTypes.INTEGER
  },
  break_id: {
    type: DataTypes.INTEGER
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'schedule_items',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['schedule_id', 'day_id', 'item_order']
    }
  ]
});

module.exports = ScheduleItem;