const Transport = require('winston-transport');

// Пишет каждую запись логгера в таблицу logs.
// Ошибки записи проглатываются (чтобы не зациклить логирование и не уронить запрос).
class DBLogTransport extends Transport {
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    try {
      // лениво, чтобы не ловить проблемы порядка загрузки модулей
      const Log = require('../models/Log');
      const message =
        typeof info.message === 'string' ? info.message : JSON.stringify(info.message);

      Log.create({
        level: info.level,
        message,
        username: info.username || null,
        ip: info.ip || null,
        meta: info.meta || null,
      }).catch(() => {});
    } catch (e) {
      // молча игнорируем — логирование не должно ломать работу
    }

    callback();
  }
}

module.exports = DBLogTransport;
