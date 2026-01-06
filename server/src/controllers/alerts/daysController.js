const Day = require("../../models/Day");


exports.getDays = async (req, res) => {
  try {
    const days = await Day.findAll({ order: [["id", "ASC"]] });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};