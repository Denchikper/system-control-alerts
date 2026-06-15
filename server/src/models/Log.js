const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Log = sequelize.define('Log', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  level: { type: DataTypes.STRING(30) },        // уровень/категория (ws_success, audit, ...)
  message: { type: DataTypes.TEXT },
  username: { type: DataTypes.STRING, allowNull: true }, // кто (для действий пользователей)
  ip: { type: DataTypes.STRING, allowNull: true },
  meta: { type: DataTypes.JSONB, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'logs',
  timestamps: false,
  indexes: [{ fields: ['created_at'] }, { fields: ['level'] }],
});

module.exports = Log;
