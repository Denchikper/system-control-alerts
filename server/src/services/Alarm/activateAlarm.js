const wsSingleton = require('../websocket/wsSingleton');

const activateAlert = (channel, isTest = false) => {
  console.log('Активируем канал:', channel, 'isTest:', isTest);

  try {
    const wsServer = wsSingleton.get();
    const sent = wsServer.sendCommand(channel, 'activate');
    if (!sent) console.warn(`⚠️ Устройство с каналом ${channel} не подключено`);
  } catch (err) {
    console.error('❌ Ошибка отправки команды на WS:', err);
  }
};

module.exports = activateAlert;