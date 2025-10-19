const ntpClient = require('ntp-client');
const logger = require('./logger');

async function syncTime() {
    try {
        logger.log('🔄 Синхронизация времени...');
        
        // Получаем точное время с NTP сервера
        const ntpTime = await new Promise((resolve, reject) => {
            ntpClient.getNetworkTime('pool.ntp.org', 123, (err, date) => {
                if (err) reject(err);
                else resolve(date);
            });
        });
        
        logger.log('✅ Время синхронизировано!');
        console.log(`⏰ Актуальное время: ${ntpTime.toLocaleString()}`);
        
        return ntpTime;
        
    } catch (error) {
        console.log('❌ Ошибка синхронизации, используем системное время');
        const localTime = new Date();
        console.log(`⏰ Системное время: ${localTime.toLocaleString()}`);
        return localTime;
    }
}

module.exports = syncTime;