const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`), quiet: true});

const config = require('./src/config');
const app = require('./src/app');
const logger = require('./src/utils/logger');
const wsSingleton = require('./src/services/websocket/wsSingleton');
const { testConnectionDB } = require('./src/test/testConnectionDB');
const { syncDatabase } = require('./src/utils/databaseSync');
const { resetDeviceStatus } = require('./src/services/websocket/resetDeviceStatus');
const { startLogRetention } = require('./src/utils/logRetention');
const alertEngine = require('./src/services/Alerts/alertEngine');

const SERVER_PORT = config.serverPort;
const SERVER_IP = config.serverIp;

require('./src/models');

const startServer = async () => {
  try {
    await testConnectionDB();
    await syncDatabase();
    await resetDeviceStatus();
    startLogRetention();

    setInterval(() => {
      alertEngine.check();
    }, 10000);

    const server = app.listen(SERVER_PORT, SERVER_IP, () => {
      logger.server_success(`Сервер запущен на http://${SERVER_IP}:${SERVER_PORT}`);
    });

    wsSingleton.init(server);
  
    logger.ws_success('WebSocket сервер запущен!');
  } catch (err) {
    logger.server_error('Ошибка запуска сервера:');
    console.log(err)
  }
};

startServer();