const Schedule = require('../../models/Schedule');
const Day = require('../../models/Day');
const ScheduleScenario = require('../../models/ScheduleScenario');
const AlertPlanned = require('../../models/AlertPlanned');
const ScheduleEvent = require('../../models/ScheduleEvent');
const controlRing = require('./controlRing');

const SINGLE_CHANNEL_ID = 6;

class AlertEngine {
  constructor() {
    this.triggeredStart = new Set();
    this.triggeredEnd = new Set();
    this.triggeredPlannedAlerts = new Set();
  }

  async check() {
    const now = new Date();

    try {
      await this.checkSchedule(now);
      // await this.checkPlannedAlerts(now);
    } catch (err) {
      console.error('AlertEngine error:', err);
    }
  }

  // Проверка всех активных расписаний
async checkSchedule(now) {
  const activeSchedules = await Schedule.findAll({ where: { is_active: true } });

  if (!activeSchedules || activeSchedules.length === 0) return;

  // !!!!!!!!!!!! НЕ ЗАБЫТЬ УБРАТЬ ЗАГЛУШКУ !!!!!!!!!!!!
  const orderIndex = now.getDay();
  // const orderIndex = 0;

  const nowLocal = new Date(now.getTime() + now.getTimezoneOffset() * 60000); 
  const nowMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();

  const day = await Day.findOne({ where: { order_index: orderIndex } });

  if (!day) {
    console.log(`День ${orderIndex} не найден!`);
    return;
  };

  for (const schedule of activeSchedules) {
    const scenario = await ScheduleScenario.findOne({
      where: { schedule_id: schedule.id, day_id: day.id },
      include: [{ model: ScheduleEvent, as: 'ScheduleEvents' }]
    });

    if (!scenario || !scenario.ScheduleEvents || scenario.ScheduleEvents.length === 0) {
      return;
    };

    for (const ev of scenario.ScheduleEvents) {
      const [startH, startM] = ev.start_time.split(':').map(Number);
      const [endH, endM] = ev.end_time.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (nowMinutes === startMinutes && !this.triggeredStart.has(ev.id)) {
        this.triggeredStart.add(ev.id);
        controlRing();
      }

      if (nowMinutes === endMinutes && !this.triggeredEnd.has(ev.id)) {
        this.triggeredEnd.add(ev.id);
        controlRing();
      }
    }
  }
}

    // Проверка плановых тревог
    async checkPlannedAlerts() {
    const nowUtc = new Date();
    const activeAlerts = await AlertPlanned.findAll({ where: { is_active: true } });

    for (const alert of activeAlerts) {
        const alertTime = new Date(alert.start_time);

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

    triggerAlert(alert) {
        console.log(`[${new Date().toISOString()}] Planned Alert triggered: ${alert.name}, target_type: ${alert.target_type}, target_id: ${alert.target_id}`);
        this.ring(SINGLE_CHANNEL_ID, 'start', 'planned_alert');
    }
    }

    module.exports = new AlertEngine();