const Device = require('../../models/Devices');
const logger = require('../../utils/logger');

async function resetDeviceStatus(){
    try {
        await Device.update({ is_online: false }, { where: {is_online: true} });
        logger.db_success('Все устройства помечены как offline.');
    } catch (err) {
        logger.db_error('Ошибка при обновлении статуса offline:', err);
    }
}

module.exports = { resetDeviceStatus };