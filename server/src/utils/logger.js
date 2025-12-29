const { createLogger, format, transports } = require('winston');
const path = require('path');
const chalk = require('chalk');

const customLevels = {
  levels: {
    remote_error: 0,     // ← самый низкий уровень
    remote_warn: 1,
    remote_success: 2,
    server_error: 3,
    server_warn: 4,
    server_success: 5,
    db_error: 6,
    db_warn: 7,
    db_success: 8,
    ws_error: 9,
    ws_warn: 10,
    ws_success: 11,
    error: 12,
    warn: 13,
    info: 14,
  },
};

// Функция для преобразования любого значения в строку
const formatMessage = (message) => {
  if (typeof message === 'object' && message !== null) {
    // Для объектов с ошибками (Error instances)
    if (message instanceof Error) {
      return `${message.message}\n${message.stack || ''}`;
    }
    
    // Для обычных объектов
    try {
      // Если есть свойство message в объекте, используем его
      if (message.message && typeof message.message === 'string') {
        const rest = { ...message };
        delete rest.message;
        // Если кроме message есть другие свойства, добавляем их
        if (Object.keys(rest).length > 0) {
          return `${message.message} ${JSON.stringify(rest, null, 2)}`;
        }
        return message.message;
      }
      
      // Для простых объектов
      return JSON.stringify(message, null, 2);
    } catch (error) {
      // Если JSON.stringify падает (циклические ссылки и т.д.)
      return String(message);
    }
  }
  
  // Для примитивов
  return String(message);
};

// Кастомный формат для логов
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const formattedMessage = formatMessage(message);
    
    // Добавляем метаданные если они есть
    let metaString = '';
    if (Object.keys(meta).length > 0 && !meta.timestamp && !meta.level) {
      metaString = ` ${JSON.stringify(meta)}`;
    }
    
    return `${timestamp} [${level.toUpperCase()}]: ${formattedMessage}${metaString}`;
  })
);

const logger = createLogger({
  levels: customLevels.levels,
  // УБРАТЬ эту строку ↓
  // level: 'remote_error',
  format: customFormat,
  transports: [
    new transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'server_error',
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log'),
      level: 'info'  // или самый низкий уровень
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../../logs/remote_error.log'), 
      level: 'remote_error' 
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../../logs/remote_combined.log'), 
      level: 'remote_warn' 
    }),
  ],
});

// Консольный транспорт только для не-продакшн
if (process.env.NODE_ENV !== 'p') {
  logger.add(
    new transports.Console({
      format: format.printf(({ level, message, ...meta }) => {
        const formattedMessage = formatMessage(message);
        let prefix = '';
        let formatted = '';

        switch (level) {
          case 'ws_success':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${formattedMessage}`;
            break;
          case 'ws_warn':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${formattedMessage}`;
            break;
          case 'ws_error':
            prefix = chalk.bgMagenta.black(' WS ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${formattedMessage}`;
            break;
          case 'db_success':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${formattedMessage}`;
            break;
          case 'db_warn':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${formattedMessage}`;
            break;
          case 'db_error':
            prefix = chalk.bgHex('#d9ead3').black(' DB ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${formattedMessage}`;
            break;
          case 'server_error':
            prefix = chalk.bgCyan.white(' SR ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${formattedMessage}`;
            break;
          case 'server_warn':
            prefix = chalk.bgCyan.black(' SR ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${formattedMessage}`;
            break;
          case 'server_success':
            prefix = chalk.bgCyan.black(' SR ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${formattedMessage}`;
            break;
          case 'remote_error':
            prefix = chalk.bgHex('#5c1aeb').black(' RM ');
            formatted = `${prefix} - ${chalk.bgRed.white(' ERROR ')} - ${formattedMessage}`;
            break;
          case 'remote_warn':
            prefix = chalk.bgHex('#5c1aeb').black(' RM ');
            formatted = `${prefix} - ${chalk.bgYellow.black(' WARN ')} - ${formattedMessage}`;
            break;
          case 'remote_success':
            prefix = chalk.bgHex('#5c1aeb').black(' RM ');
            formatted = `${prefix} - ${chalk.bgGreen.black(' SUCCESS ')} - ${formattedMessage}`;
            break;
          default:
            prefix = chalk.bgGray.black(' LOG ');
            formatted = `${prefix} - ${chalk.white(' MESSAGE ')} - ${formattedMessage}`;
        }
        
        // Добавляем метаданные если есть
        if (Object.keys(meta).length > 0) {
          formatted += chalk.gray(` ${JSON.stringify(meta)}`);
        }
        
        return formatted;
      }),
    })
  );
}

// Методы логгера с поддержкой объектов
logger.ws_success = (msg, meta) => logger.log({ level: 'ws_success', message: msg, ...meta });
logger.ws_error = (msg, meta) => logger.log({ level: 'ws_error', message: msg, ...meta });
logger.ws_warn = (msg, meta) => logger.log({ level: 'ws_warn', message: msg, ...meta });
logger.db_success = (msg, meta) => logger.log({ level: 'db_success', message: msg, ...meta });
logger.db_warn = (msg, meta) => logger.log({ level: 'db_warn', message: msg, ...meta }); 
logger.db_error = (msg, meta) => logger.log({ level: 'db_error', message: msg, ...meta });
logger.server_success = (msg, meta) => logger.log({ level: 'server_success', message: msg, ...meta });
logger.server_warn = (msg, meta) => logger.log({ level: 'server_warn', message: msg, ...meta });
logger.server_error = (msg, meta) => logger.log({ level: 'server_error', message: msg, ...meta });
logger.remote_success = (msg, meta) => logger.log({ level: 'remote_success', message: msg, ...meta });
logger.remote_warn = (msg, meta) => logger.log({ level: 'remote_warn', message: msg, ...meta });
logger.remote_error = (msg, meta) => logger.log({ level: 'remote_error', message: msg, ...meta });

// Удобные методы для объектов
logger.ws_successObj = (obj, description = '') => {
  const message = description ? `${description}: ${JSON.stringify(obj, null, 2)}` : JSON.stringify(obj, null, 2);
  logger.log({ level: 'ws_success', message });
};

logger.db_errorObj = (obj, description = '') => {
  const message = description ? `${description}: ${JSON.stringify(obj, null, 2)}` : JSON.stringify(obj, null, 2);
  logger.log({ level: 'db_error', message });
};

logger.server_errorObj = (obj, description = '') => {
  const message = description ? `${description}: ${JSON.stringify(obj, null, 2)}` : JSON.stringify(obj, null, 2);
  logger.log({ level: 'server_error', message });
};

logger.remote_errorObj = (obj, description = '') => {
  const message = description ? `${description}: ${JSON.stringify(obj, null, 2)}` : JSON.stringify(obj, null, 2);
  logger.log({ level: 'remote_error', message });
};

module.exports = logger;