const { createLogger, format, transports } = require('winston');
const path = require('path');
const { default: chalk } = require('chalk');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      // Логи в файлы с временем
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        // Убираем timestamp для консоли:
        format.printf(({ level, message }) => {
          let coloredLevel;

          switch (level) {
            case 'error':
              coloredLevel = chalk.bgRed.white(` ${level.toUpperCase()} `);
              break;
            case 'warn':
              coloredLevel = chalk.bgYellow.black(` ${level.toUpperCase()} `);
              break;
            case 'info':
              coloredLevel = chalk.bgBlue.white(` ${level.toUpperCase()} `);
              break;
            default:
              coloredLevel = chalk.white(level.toUpperCase());
          }

          return `${coloredLevel} ${message}`;
        })
      ),
    })
  );
}

module.exports = logger;
