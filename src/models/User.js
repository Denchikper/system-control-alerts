const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user"
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;