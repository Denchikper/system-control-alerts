// Каталог прав доступа: разделы (страницы) и блоки (части UI).
// Используется и бэкендом (gating роутов), и фронтом (редактор ролей, скрытие UI).
const CATALOG = [
  { key: 'section:dashboard', label: 'Главная', group: 'Разделы' },
  { key: 'section:alarms', label: 'Тревоги', group: 'Разделы' },
  { key: 'section:plannedalerts', label: 'Запланированные оповещения', group: 'Разделы' },
  { key: 'section:devices', label: 'Устройства', group: 'Разделы' },
  { key: 'section:settings', label: 'Настройки', group: 'Разделы' },

  { key: 'block:dashboard.systemStatus', label: 'Статус системы (дашборд)', group: 'Блоки' },
  { key: 'block:dashboard.alarmControl', label: 'Управление тревогами вкл/выкл (дашборд)', group: 'Блоки' },
  { key: 'block:dashboard.changeDuty', label: 'Смена дежурного (дашборд)', group: 'Блоки' },
  { key: 'block:settings.users', label: 'Управление пользователями', group: 'Блоки' },
  { key: 'block:settings.roles', label: 'Управление ролями и доступами', group: 'Блоки' },
  { key: 'block:settings.logs', label: 'Просмотр журнала (логов)', group: 'Блоки' },
];

const ALL_KEYS = CATALOG.map((c) => c.key);

const ADMIN_ROLE = 'admin';

module.exports = { CATALOG, ALL_KEYS, ADMIN_ROLE };
