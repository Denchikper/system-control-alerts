const WebSocket = require('ws');

const NameDevice = "Device-DEBUG";
const SERVER_URL = 'ws://192.168.1.99:2255';
// auth_token устройства из веб-панели (страница «Устройства»)
const DeviceToken = process.env.DEVICE_TOKEN || 'PASTE_DEVICE_AUTH_TOKEN_HERE';

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log(`🔗 Устройство подключено к серверу`);
  ws.send(JSON.stringify({ type: 'register', nameDevice: NameDevice, token: DeviceToken }));
});

ws.on('message', (message) => {
  try {
    const data = JSON.parse(message);

    if (data.command === 'activatealarm') {
      if (Array.isArray(data.channel)) {
        console.log(`🟢 Активированы пины: ${data.channel.join(', ')} (тренировочный режим)`);
      } else {
        console.log(`🟢 Пин ${data.channel} активирован`);
        // Длительность отсчитывает «устройство» — сервер стоп не присылает
        if (data.duration > 0) {
          setTimeout(() => {
            console.log(`⏱️ Пин ${data.channel} выключен по истечении ${data.duration} мс`);
          }, data.duration);
        }
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
