const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../../utils/logger");


exports.userChangePassController = async (req, res) => {
  const { username, new_password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    user.password_hash = password_hash;
    await user.save();

    return res.status(200).json({
      message: `Пароль пользователя ${user.username} обновлён`,
    });
  } catch (err) {
    logger.server_error("Ошибка при изменении пароля.");
    console.error(err);

    return res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};