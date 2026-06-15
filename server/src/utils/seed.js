const bcrypt = require('bcryptjs');
const logger = require('./logger');
const Day = require('../models/Day');
const Schedule = require('../models/Schedule');
const ScheduleScenario = require('../models/ScheduleScenario');
const Role = require('../models/Role');
const User = require('../models/User');
const Channel = require('../models/Channel');
const { ALL_KEYS, ADMIN_ROLE } = require('../config/permissions');

// Базовые каналы (id важны: на них завязаны RING_CHANNEL_ID, alarm.channel, цели оповещений)
const CHANNELS = [
  { id: 1, pin_number: 1, name: 'Пожарная тревога', is_drill: false, duration: 500 },
  { id: 2, pin_number: 2, name: 'Ракетная тревога', is_drill: false, duration: 500 },
  { id: 3, pin_number: 3, name: 'Воздушная тревога', is_drill: false, duration: 500 },
  { id: 4, pin_number: 4, name: 'Химическая тревога', is_drill: false, duration: 500 },
  { id: 6, pin_number: 6, name: 'Звонок', is_drill: false, duration: 5000 },
  { id: 7, pin_number: 7, name: 'Учебная тревога', is_drill: true, duration: 500 },
];

// order_index = значение JS Date.getDay() (Вс=0 … Сб=6) — так его сверяет alertEngine.
// Порядок в массиве (Пн→Вс) задаёт человекочитаемую сортировку колонок в сетке.
const DAYS = [
  { name: 'Понедельник', order_index: 1 },
  { name: 'Вторник', order_index: 2 },
  { name: 'Среда', order_index: 3 },
  { name: 'Четверг', order_index: 4 },
  { name: 'Пятница', order_index: 5 },
  { name: 'Суббота', order_index: 6 },
  { name: 'Воскресенье', order_index: 0 },
];

// Создаёт дни недели, если их ещё нет (идемпотентно).
async function seedDays() {
  let created = 0;
  for (const day of DAYS) {
    const [, isNew] = await Day.findOrCreate({
      where: { name: day.name },
      defaults: day,
    });
    if (isNew) created++;
  }
  if (created > 0) logger.db_success(`Сид: создано дней недели — ${created}`);
}

// Гарантирует, что у каждого расписания есть сценарий на каждый день
// (чинит расписания, созданные когда таблица days была пустой).
async function backfillScenarios() {
  const days = await Day.findAll();
  const schedules = await Schedule.findAll();
  let created = 0;
  for (const schedule of schedules) {
    for (const day of days) {
      const [, isNew] = await ScheduleScenario.findOrCreate({
        where: { schedule_id: schedule.id, day_id: day.id },
        defaults: { schedule_id: schedule.id, day_id: day.id },
      });
      if (isNew) created++;
    }
  }
  if (created > 0) logger.db_success(`Сид: до-создано сценариев расписаний — ${created}`);
}

// Системная роль admin (полный доступ) + роли для уже существующих пользователей.
async function seedRoles() {
  const [admin, adminNew] = await Role.findOrCreate({
    where: { name: ADMIN_ROLE },
    defaults: { name: ADMIN_ROLE, permissions: ALL_KEYS, is_system: true },
  });
  // Держим у admin актуальный полный набор прав и системный флаг
  if (!admin.is_system || admin.permissions.length !== ALL_KEYS.length) {
    admin.permissions = ALL_KEYS;
    admin.is_system = true;
    await admin.save();
  }
  if (adminNew) logger.db_success('Сид: создана системная роль admin');

  // Создаём недостающие роли для ролей, уже назначенных пользователям
  const users = await User.findAll();
  const names = [...new Set(users.map((u) => u.role).filter(Boolean))];
  for (const name of names) {
    if (name === ADMIN_ROLE) continue;
    await Role.findOrCreate({ where: { name }, defaults: { name, permissions: [] } });
  }
}

// Создаёт каналы, если их ещё нет (идемпотентно, по id)
async function seedChannels() {
  let created = 0;
  for (const ch of CHANNELS) {
    const [, isNew] = await Channel.findOrCreate({ where: { id: ch.id }, defaults: ch });
    if (isNew) created++;
  }
  if (created > 0) logger.db_success(`Сид: создано каналов — ${created}`);
}

// Бутстрап: если пользователей нет вообще — создаём admin/admin,
// иначе первого администратора было бы неоткуда завести (регистрация под правом).
async function seedAdminUser() {
  const count = await User.count();
  if (count > 0) return;
  const password_hash = await bcrypt.hash('admin', await bcrypt.genSalt(10));
  await User.create({ username: 'admin', password_hash, first_name: 'Admin', role: ADMIN_ROLE });
  logger.db_warn('Сид: создан администратор по умолчанию admin / admin — смените пароль!');
}

async function seedDatabase() {
  await seedDays();
  await seedChannels();
  await backfillScenarios();
  await seedRoles();
  await seedAdminUser();
}

module.exports = { seedDatabase };
