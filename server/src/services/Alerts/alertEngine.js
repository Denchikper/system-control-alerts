const Schedule = require('../../models/Schedule');
const Day = require('../../models/Day');
const ScheduleScenario = require('../../models/ScheduleScenario');
const AlertPlanned = require('../../models/AlertPlanned');
const ScheduleEvent = require('../../models/ScheduleEvent');
const controlRing = require('./controlRing');
const logger = require('../../utils/logger');

const SINGLE_CHANNEL_ID = 6;

class AlertEngine {
  constructor() {
    this.triggeredStart = new Set();
    this.triggeredEnd = new Set();
    this.triggeredPlannedAlerts = new Set();
    this.missingDayWarnings = new Set();
    this.missingScenarioWarnings = new Set();
    this.lastCleanupDate = null;
  }

  cleanupDailyState(dayKey) {
    if (this.lastCleanupDate === dayKey) return;

    this.triggeredStart.clear();
    this.triggeredEnd.clear();
    this.triggeredPlannedAlerts.clear();
    this.missingDayWarnings.clear();
    this.missingScenarioWarnings.clear();
    this.lastCleanupDate = dayKey;
  }

  async check() {
    const now = new Date();

    try {
      await this.checkSchedule(now);
      // await this.checkPlannedAlerts(now);
    } catch (err) {
      logger.alertengine_error(`AlertEngine error: ${err.stack || err}`);
    }
  }

  async checkSchedule(now) {
    const activeSchedules = await Schedule.findAll({ where: { is_active: true } });
    if (!activeSchedules || activeSchedules.length === 0) return;

    const dayKey = now.toISOString().slice(0, 10);
    this.cleanupDailyState(dayKey);

    const orderIndex = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const day = await Day.findOne({ where: { order_index: orderIndex } });

    if (!day) {
      const warningKey = `${orderIndex}:${dayKey}`;
      if (!this.missingDayWarnings.has(warningKey)) {
        this.missingDayWarnings.add(warningKey);
        logger.alertengine_warn(`День с order_index=${orderIndex} не найден`);
      }
      return;
    }

    for (const schedule of activeSchedules) {
      const scenario = await ScheduleScenario.findOne({
        where: { schedule_id: schedule.id, day_id: day.id },
        include: [{ model: ScheduleEvent, as: 'ScheduleEvents' }]
      });

      if (!scenario || !scenario.ScheduleEvents || scenario.ScheduleEvents.length === 0) {
        const warningKey = `${schedule.id}:${day.id}:${dayKey}`;
        if (!this.missingScenarioWarnings.has(warningKey)) {
          this.missingScenarioWarnings.add(warningKey);
          logger.alertengine_warn(`Сценарий для ${day.name} не найден у активного расписания id=${schedule.id}`);
        }
        continue;
      }

      for (const ev of scenario.ScheduleEvents) {
        const [startH, startM] = ev.start_time.split(':').map(Number);
        const [endH, endM] = ev.end_time.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        const startTriggerKey = `${dayKey}:start:${ev.id}`;
        const endTriggerKey = `${dayKey}:end:${ev.id}`;

        if (nowMinutes === startMinutes && !this.triggeredStart.has(startTriggerKey)) {
          this.triggeredStart.add(startTriggerKey);
          await controlRing();
        }

        if (nowMinutes === endMinutes && !this.triggeredEnd.has(endTriggerKey)) {
          this.triggeredEnd.add(endTriggerKey);
          await controlRing();
        }
      }
    }
  }

  async checkPlannedAlerts() {
    const nowUtc = new Date();
    const dayKey = nowUtc.toISOString().slice(0, 10);
    this.cleanupDailyState(dayKey);

    const activeAlerts = await AlertPlanned.findAll({ where: { is_active: true } });

    for (const alert of activeAlerts) {
      const alertTime = new Date(alert.start_time);
      let shouldTrigger = false;

      switch (alert.recurrence) {
        case 'once':
          shouldTrigger =
            alertTime.getUTCFullYear() === nowUtc.getUTCFullYear() &&
            alertTime.getUTCMonth() === nowUtc.getUTCMonth() &&
            alertTime.getUTCDate() === nowUtc.getUTCDate() &&
            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
          break;

        case 'daily':
          shouldTrigger =
            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
          break;

        case 'weekly':
          shouldTrigger =
            alertTime.getUTCDay() === nowUtc.getUTCDay() &&
            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
          break;

        case 'monthly':
          shouldTrigger =
            alertTime.getUTCDate() === nowUtc.getUTCDate() &&
            alertTime.getUTCHours() === nowUtc.getUTCHours() &&
            alertTime.getUTCMinutes() === nowUtc.getUTCMinutes();
          break;
      }

      const triggerKey = `${dayKey}:planned:${alert.id}`;
      if (shouldTrigger && !this.triggeredPlannedAlerts.has(triggerKey)) {
        this.triggeredPlannedAlerts.add(triggerKey);
        this.triggerAlert(alert);
      }
    }
  }

  triggerAlert(alert) {
    logger.alertengine_success(
      `[${new Date().toISOString()}] Planned Alert triggered: ${alert.name}, target_type: ${alert.target_type}, target_id: ${alert.target_id}`
    );
    return controlRing(SINGLE_CHANNEL_ID, 'start', 'planned_alert');
  }
}

module.exports = new AlertEngine();
