const { createLogger, format, transports } = require('winston');
const path = require('path');
const chalk = require('chalk');

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    ws_success: 3,
    ws_error: 4,
    ws_warn: 5,
    db_success: 6,
    db_warn: 7,
    db_error: 8,
    server_success: 9,
    server_warn: 10,
    server_error: 11,
  },
};

const logger = createLogger({
  levels: customLevels.levels,
  level: 'server_error',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'server_error' }),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.printf(({ level, message }) => {
        let prefix = '';
        let formatted = '';

        switch (level) {
          case 'ws_success':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${message}`;
            break;
          case 'ws_warn':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${message}`;
            break;
          case 'ws_error':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${message}`;
            break;
          case 'db_success':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${message}`;
            break;
          case 'db_warn':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${message}`;
            break;
          case 'db_error':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${message}`;
            break;
          case 'server_error':
            prefix = chalk.bgRed.white(' SR ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${message}`;
            break;
          case 'server_warn':
            prefix = chalk.bgYellow.black(' SR ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${message}`;
            break;
          case 'server_success':
            prefix = chalk.bgCyan.black(' SR ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${message}`;
            break;
          default:
            prefix = chalk.bgGray.black(' LOG ');
            formatted = `${prefix} - ${chalk.white(' MESSAGE ')} - ${message}`;
        }

        return formatted;
      }),
    })
  );
}

logger.ws_success = (msg) => logger.log({ level: 'ws_success', message: msg });
logger.ws_error = (msg) => logger.log({ level: 'ws_error', message: msg });
logger.ws_warn = (msg) => logger.log({ level: 'ws_warn', message: msg });
logger.db_success = (msg) => logger.log({ level: 'db_success', message: msg });
logger.db_warn = (msg) => logger.log({ level: 'db_warn', message: msg }); 
logger.db_error = (msg) => logger.log({ level: 'db_error', message: msg });
logger.server_success = (msg) => logger.log({ level: 'server_success', message: msg });
logger.server_warn = (msg) => logger.log({ level: 'server_warn', message: msg });
logger.server_error = (msg) => logger.log({ level: 'server_error', message: msg });


module.exports = logger;
