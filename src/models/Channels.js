const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Channels = sequelize.define('Channels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    channel_id: {
      type: DataTypes.STRING(100),  // ID канала для воспроизведения
      allowNull: false
    }
  }, {
    tableName: 'channels',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Channels;
};