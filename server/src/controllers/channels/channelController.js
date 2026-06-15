const Channel = require("../../models/Channel.js");

// Получить все каналы
exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll({ order: [["id", "ASC"]] });
    res.json(channels);
  } catch (error) {
    console.error("Ошибка при получении каналов:", error);
    res.status(500).json({ error: "Ошибка при получении каналов" });
  }
};
