#include "alarmManager.h"
#include <ArduinoJson.h>

// === ПИНЫ РЕЛЕ ===
#define RELAY_CH1 2
#define RELAY_CH2 4
#define RELAY_CH3 5
#define RELAY_CH4 3
#define RELAY_CH5 14
#define RELAY_CH6 17
#define RELAY_CH7 15

struct ChannelDelay {
  int channel;
  unsigned long delayMs;
};

bool alarmActive = false;        // общий статус тревоги
bool cycleMode = false;          // режим последовательного включения с задержками
ChannelDelay channels[10];       // максимум 10 каналов
int channelCount = 0;
int currentIndex = 0;
unsigned long lastSwitch = 0;
bool channelOn = false;          // текущий статус канала в цикле
int singleChannel = -1;          // для одиночного канала


// --- Выключить все реле (HIGH = выкл, LOW = вкл) ---
void deactivateAllRelays() {
  digitalWrite(RELAY_CH1, HIGH);
  digitalWrite(RELAY_CH2, HIGH);
  digitalWrite(RELAY_CH3, HIGH);
  digitalWrite(RELAY_CH4, HIGH);
  digitalWrite(RELAY_CH5, HIGH);
  digitalWrite(RELAY_CH6, HIGH);
  digitalWrite(RELAY_CH7, HIGH);
}

void setupAlarm() {
  pinMode(RELAY_CH1, OUTPUT);
  pinMode(RELAY_CH2, OUTPUT);
  pinMode(RELAY_CH3, OUTPUT);
  pinMode(RELAY_CH4, OUTPUT);
  pinMode(RELAY_CH5, OUTPUT);
  pinMode(RELAY_CH6, OUTPUT);
  pinMode(RELAY_CH7, OUTPUT);

  deactivateAllRelays();
}

// --- Управление конкретным реле ---
// ВНИМАНИЕ: LOW = включить, HIGH = выключить
void setRelayState(int channel, bool state) {
  bool pinState = state ? LOW : HIGH; // инверсия логики
  switch (channel) {
    case 1: digitalWrite(RELAY_CH1, pinState); break;
    case 2: digitalWrite(RELAY_CH2, pinState); break;
    case 3: digitalWrite(RELAY_CH3, pinState); break;
    case 4: digitalWrite(RELAY_CH4, pinState); break;
    case 5: digitalWrite(RELAY_CH5, pinState); break;
    case 6: digitalWrite(RELAY_CH6, pinState); break;
    case 7: digitalWrite(RELAY_CH7, pinState); break;
    default: break;
  }
}

void handleAlarmCommand(const String& jsonStr) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, jsonStr);
  if (error) {
    return;
  }

  const char* command = doc["command"];
  if (strcmp(command, "deactivatealarm") == 0) {
    alarmActive = false;
    cycleMode = false;
    singleChannel = -1;
    deactivateAllRelays();
    return;
  }

  if (strcmp(command, "activatealarm") == 0) {
    if (doc["channel"].is<JsonArray>()) {
      // режим с чередованием каналов и задержками
      JsonArray arr = doc["channel"].as<JsonArray>();
      channelCount = 0;
      for (size_t i = 0; i + 1 < arr.size() && channelCount < 10; i += 2) {
        channels[channelCount].channel = arr[i];
        channels[channelCount].delayMs = arr[i + 1];
        channelCount++;
      }
      currentIndex = 0;
      lastSwitch = millis();
      channelOn = false;
      cycleMode = true;
      alarmActive = true;
    } else {
      // одиночный канал
      singleChannel = doc["channel"];
      setRelayState(singleChannel, true);
      alarmActive = true;
      cycleMode = false;
    }
  }
}

void updateAlarm() {
  if (!alarmActive) return;

  if (cycleMode && channelCount > 0) {
    unsigned long now = millis();
    if (!channelOn || now - lastSwitch >= channels[currentIndex].delayMs) {
      if (channelOn) {
        setRelayState(channels[currentIndex].channel, false);
        currentIndex++;
        if (currentIndex >= channelCount) currentIndex = 0;
      }

      setRelayState(channels[currentIndex].channel, true);
      lastSwitch = now;
      channelOn = true;
    }
  } else if (!cycleMode && singleChannel != -1) {
    // одиночный канал включен, просто удерживаем
  }
}
