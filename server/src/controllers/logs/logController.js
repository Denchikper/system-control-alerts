const { Op } = require('sequelize');
const Log = require('../../models/Log');

exports.getLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = parseInt(req.query.offset, 10) || 0;
    const { level, q } = req.query;

    const where = {};
    if (level) where.level = level;
    if (q) {
      where[Op.or] = [
        { message: { [Op.iLike]: `%${q}%` } },
        { username: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const { rows, count } = await Log.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    res.json({ rows, count, limit, offset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Список уровней для фильтра
exports.getLogLevels = async (req, res) => {
  try {
    const rows = await Log.findAll({
      attributes: [[Log.sequelize.fn('DISTINCT', Log.sequelize.col('level')), 'level']],
      order: [['level', 'ASC']],
      raw: true,
    });
    res.json(rows.map((r) => r.level).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
