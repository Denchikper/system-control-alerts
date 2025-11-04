#ifndef ALARMMANAGER_H
#define ALARMMANAGER_H

#include <Arduino.h>

void handleAlarmCommand(const String& jsonStr);
void updateAlarm();
void setupAlarm();

#endif
