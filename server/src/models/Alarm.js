const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Alarm = sequelize.define('Alarm', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_remote: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_drill: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  channel: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'alarm',
  timestamps: false,
  underscored: true,
});

module.exports = Alarm;