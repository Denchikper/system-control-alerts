const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../../utils/logger");
const crypto = require("crypto");

const GenerateCode = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = array[0] % 1000000;
  return code.toString().padStart(6, "0");
};

exports.dutyChangePassController = async (req, res) => {
  try {
    const duty_officer = await User.findOne({
      where: { username: "duty_officer" },
    });

    if (!duty_officer) {
      return res.status(404).json({ message: "Пользователь duty_officer не найден" });
    }

    const new_code = GenerateCode();

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_code, salt);

    duty_officer.password_hash = password_hash;
    await duty_officer.save();

    return res.status(200).json({
      message: "Пароль duty_officer обновлён",
      code: new_code,
    });
  } catch (err) {
    logger.server_error("Ошибка при изменении пароля duty_officer");
    console.error(err);

    return res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};