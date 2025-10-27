const wsSingleton = require('../websocket/wsSingleton');

const deactivateAlert = (channel) => {
  console.log('Деактивируем канал:', channel);

  try {
    const wsServer = wsSingleton.get();
    const sent = wsServer.sendCommand(channel, 'deactivate');
    if (!sent) console.warn(`⚠️ Устройство с каналом ${channel} не подключено`);
  } catch (err) {
    console.error('❌ Ошибка отправки команды на WS:', err);
  }
};

module.exports = deactivateAlert;