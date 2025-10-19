const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AlertsLogs = sequelize.define('AlertsLogs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actual_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('success', 'error', 'skipped'),
      allowNull: false
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    channel_id: {
      type: DataTypes.STRING(100), 
      allowNull: false
    }
  }, {
    tableName: 'alerts_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['scheduled_time']
      },
      {
        fields: ['device_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  return AlertsLogs;
};