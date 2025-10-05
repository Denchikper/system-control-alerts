const app = require('./src/app');
const logger = require('./src/utils/logger');

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_IP = process.env.SERVER_IP;


const startServer = async () => {
  try {
    // await testConnectionDB(); // проверка соединения с БД
    // await syncDatabase();
    // await checkSmtpConnection(); // проверка соединения с SMTP-сервером
    // await checkConnectionOS(); // проверка соединения с Yandex Object Storage

    app.listen(SERVER_PORT, SERVER_IP, () => {
      logger.info(`✅ Сервер запущен на http://${SERVER_IP}:${SERVER_PORT}`);
    });
  } catch (err) {
    logger.error('❌ Ошибка запуска сервера:', err);
  }
};

startServer();