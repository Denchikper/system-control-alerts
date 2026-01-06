// services/alertEngine.js
const { Op } = require('sequelize');
const Schedule = require('../../models/Schedule');
const Day = require('../../models/Day');
const ScheduleScenario = require('../../models/ScheduleScenario');
const AlertPlanned = require('../../models/AlertPlanned');
const ScheduleEvent = require('../../models/ScheduleEvent');
const Channel = require('../../models/Channel');
const controlRing = require('./controlRing');

const SINGLE_CHANNEL_ID = 6;

class AlertEngine {
  constructor() {
    this.triggeredStart = new Set(); // события начала урока/перемены
    this.triggeredEnd = new Set();   // события конца урока/перемены
    this.triggeredPlannedAlerts = new Set();
  }

  async check() {
    const now = new Date();

    try {
      await this.checkSchedule(now);
      await this.checkPlannedAlerts(now);
    } catch (err) {
      console.error('AlertEngine error:', err);
    }
  }

  // Проверка всех активных расписаний
async checkSchedule(now) {
  const activeSchedules = await Schedule.findAll({ where: { is_active: true } });
  if (!activeSchedules || activeSchedules.length === 0) return;

  // !!!!!!!!!!!! НЕ ЗАБЫТЬ УБРАТЬ ЗАГЛУШКУ !!!!!!!!!!!!
  const jsDay = now.getDay(); // 0 = Sunday
  // const jsDay = 4;
  const orderIndex = jsDay === 0 ? 7 : jsDay;

  // Приводим текущее время к минутам локального времени
  const nowLocal = new Date(now.getTime() + now.getTimezoneOffset() * 60000); 
  const nowMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();

  for (const schedule of activeSchedules) {
    const day = await Day.findOne({ where: { order_index: orderIndex } });
    if (!day) continue;

    const scenario = await ScheduleScenario.findOne({
      where: { schedule_id: schedule.id, day_id: day.id },
      include: [{ model: ScheduleEvent, as: 'ScheduleEvents' }]
    });
    if (!scenario || !scenario.ScheduleEvents || scenario.ScheduleEvents.length === 0) continue;

    for (const ev of scenario.ScheduleEvents) {
      // TIME поля из базы в формате 'HH:MM:SS'
      const [startH, startM] = ev.start_time.split(':').map(Number);
      const [endH, endM] = ev.end_time.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      // Включение звонка в начале события
      if (nowMinutes === startMinutes && !this.triggeredStart.has(ev.id)) {
        this.triggeredStart.add(ev.id);
        controlRing();
      }

      // Включение звонка в конце события
      if (nowMinutes === endMinutes && !this.triggeredEnd.has(ev.id)) {
        this.triggeredEnd.add(ev.id);
        controlRing();
      }
    }
  }
}

    // Проверка плановых тревог
    async checkPlannedAlerts() {
    const nowUtc = new Date(); // текущее время UTC
    const activeAlerts = await AlertPlanned.findAll({ where: { is_active: true } });

    for (const alert of activeAlerts) {
        const alertTime = new Date(alert.start_time); // в UTC

        let shouldTrigger = false;

        switch (alert.recurrence) {
        case 'once':
            shouldTrigger = alertTime.getUTCFullYear() === nowUtc.getUTCFullYear() &&
                            alertTime.getUTCMonth() === nowUtc.getUTCMonth() &&
                            alertTime.getUTCDate() === nowUtc.getUTCDate() &&
                            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
                            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
            break;

        case 'daily':
            shouldTrigger = alertTime.getUTCHours() === nowUtc.getUTCHours() &&
                            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
            break;

        case 'weekly':
            shouldTrigger = alertTime.getUTCDay() === nowUtc.getUTCDay() &&
                            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
                            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
            break;

        case 'monthly':
            shouldTrigger = alertTime.getUTCDate() === nowUtc.getUTCDate() &&
                            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
                            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
            break;
        }

        if (shouldTrigger && !this.triggeredPlannedAlerts.has(alert.id)) {
        this.triggeredPlannedAlerts.add(alert.id);
        this.triggerAlert(alert);
        }
    }
    }

    // Симуляция включения звонка
    ring(channelId, type, eventType = '') {
        console.log(`[${new Date().toISOString()}] Channel ${channelId} ${type} (${eventType})`);
    }

    triggerAlert(alert) {
        console.log(`[${new Date().toISOString()}] Planned Alert triggered: ${alert.name}, target_type: ${alert.target_type}, target_id: ${alert.target_id}`);
        this.ring(SINGLE_CHANNEL_ID, 'start', 'planned_alert');
    }
    }

    module.exports = new AlertEngine();