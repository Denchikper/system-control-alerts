const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Day = sequelize.define('Day', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'days',
  timestamps: false
});

module.exports = Day;