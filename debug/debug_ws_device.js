const WebSocket = require('ws');

// Каждый “устройство” запускается как отдельный клиент для отладки
const NameDevice = "Device-DEBUG";
const SERVER_URL = 'ws://192.168.1.99:2255'; // Адрес основного сервера

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log(`🔗 Устройство подключено к серверу`);
  // При подключении отправляем идентификатор устройства
  ws.send(JSON.stringify({ type: 'register', nameDevice: NameDevice }));
});

ws.on('message', (message) => {
  try {
    const data = JSON.parse(message);

    if (data.command === 'activatealarm') {
      if (Array.isArray(data.channel)) {
        console.log(`🟢 Активированы пины: ${data.channel.join(', ')} (тренировочный режим)`);
      } else {
        console.log(`🟢 Пин ${data.channel} активирован`);
      }
    } else if (data.command === 'deactivatealarm') {
      console.log(`🔵 Деактивированы все активные тревоги.`);
    } else {
      console.log('⚠️ Неизвестная команда', data);
    }

  } catch (err) {
    console.error('❌ Ошибка обработки сообщения:', err);
  }
});


ws.on('close', () => console.log('❌ Соединение с сервером закрыто'));
ws.on('error', (err) => console.error('⚠️ Ошибка WS:', err));
