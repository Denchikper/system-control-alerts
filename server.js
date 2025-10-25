const app = require('./src/app');
const logger = require('./src/utils/logger');
// const syncTime = require('./src/utils/timeSyncService');
const WebSocketServer = require('./src/services/websocket/websocket-server');

const { testConnectionDB } = require('./src/test/testConnectionDB');
const { syncDatabase } = require('./src/utils/databaseSync');

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_IP = process.env.SERVER_IP;

require('./src/models');

const startServer = async () => {
  try {
    await testConnectionDB(); // проверка соединения с БД
    await syncDatabase();
    
    // await syncTime( ); // Синхронизируем время и выводим актуальное
    
    const httpServer = app.listen(SERVER_PORT, SERVER_IP, () => {
      logger.info(`✅ Сервер запущен на http://${SERVER_IP}:${SERVER_PORT}`);
    });

    new WebSocketServer(httpServer);

    logger.info('✅ WebSocket сервер запущен');
  } catch (err) {
    logger.error('❌ Ошибка запуска сервера:', err);
  }
};

startServer();