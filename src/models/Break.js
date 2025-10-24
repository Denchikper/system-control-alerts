const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Break = sequelize.define('Break', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    defaultValue: 'Перемена'
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'breaks',
  timestamps: false
});

module.exports = Break;