const User = require("../../models/User");
const bcrypt = require('bcryptjs');

exports.checkDutyCode = async (code) => {
    try {
        const duty_officer = await User.findOne({ where: { username: "duty_officer" }})

        const isMatch = await bcrypt.compare(code, duty_officer.password_hash);
        return isMatch
    } catch {
        logger.remote_error('Ошибка:', err);
    }
};