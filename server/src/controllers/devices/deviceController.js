const Device = require("../../models/Devices.js");

// Получить все устройства
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({ order: [["id", "ASC"]] });
    res.json(devices);
  } catch (error) {
    console.error("Ошибка при получении устройств:", error);
    res.status(500).json({ error: "Ошибка при получении устройств" });
  }
}

// Создать новое устройство
exports.createDevice = async (req, res) => {
  try {
    const { name, device_name, device_type, ip_address, description } = req.body;

    const newDevice = await Device.create({
      name,
      device_name,
      device_type,
      ip_address,
      description,
    });

    res.status(201).json(newDevice);
  } catch (error) {
    console.error("Ошибка при создании устройства:", error);
    res.status(500).json({ error: "Ошибка при создании устройства" });
  }
}

// Обновить устройство
exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByPk(id);
    if (!device) return res.status(404).json({ error: "Устройство не найдено" });

    const { name, device_name, device_type, ip_address, description } = req.body;
    await device.update({ name, device_name, device_type, ip_address, description });

    res.json(device);
  } catch (error) {
    console.error("Ошибка при обновлении устройства:", error);
    res.status(500).json({ error: "Ошибка при обновлении устройства" });
  }
}

// Удалить устройство
exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByPk(id);
    if (!device) return res.status(404).json({ error: "Устройство не найдено" });

    await device.destroy();
    res.json({ message: "Устройство удалено" });
  } catch (error) {
    console.error("Ошибка при удалении устройства:", error);
    res.status(500).json({ error: "Ошибка при удалении устройства" });
  }
}
