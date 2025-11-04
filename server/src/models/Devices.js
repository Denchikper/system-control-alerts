const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  device_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  device_type: {
    type: DataTypes.ENUM('relay', 'receiver'), // ✅ только два варианта
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: { // ✅ исправлена опечатка
    type: DataTypes.STRING
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'devices',
  timestamps: true,
  underscored: true
});

module.exports = Device;
