const WebSocket = require('ws');

// Каждый “устройство” запускается как отдельный клиент для отладки
const CHANNEL_ID = process.env.CHANNEL_ID || 1; // Можно задать при запуске
const SERVER_URL = 'ws://localhost:2255'; // Адрес основного сервера

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log(`🔗 Устройство подключено к серверу`);
  // При подключении отправляем идентификатор устройства
  ws.send(JSON.stringify({ type: 'register', channelId: CHANNEL_ID }));
});

ws.on('message', (message) => {
  try {
    const data = JSON.parse(message);

    // Реакция на команды
    if (data.command === 'activate') {
      console.log(`🚨 Канал ${CHANNEL_ID} активирован`);
    } else if (data.command === 'deactivate') {
      console.log(`🟢 Канал ${CHANNEL_ID} деактивирован`);
    } else {
      console.log('⚠️ Неизвестная команда');
    }

  } catch (err) {
    console.error('❌ Ошибка обработки сообщения:', err);
  }
});

ws.on('close', () => console.log('❌ Соединение с сервером закрыто'));
ws.on('error', (err) => console.error('⚠️ Ошибка WS:', err));
