const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  device_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  device_type: {
    type: DataTypes.STRING,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  device_port: {
    type: DataTypes.INTEGER
  },
  desciption: {
    type: DataTypes.STRING
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
  }
}, {
  tableName: 'devices',
  timestamps: true,
  underscored: true
});

module.exports = Device;