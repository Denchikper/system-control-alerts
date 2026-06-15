const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  // Список ключей прав (из config/permissions.js)
  permissions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  // Системную роль (admin) нельзя удалить, у неё всегда полный доступ
  is_system: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'roles',
  timestamps: false,
});

module.exports = Role;
