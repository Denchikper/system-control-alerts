#include "alarmManager.h"
#include <ArduinoJson.h>

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

void handleAlarmCommand(const String& jsonStr) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, jsonStr);
  if(error) {
    Serial.println("[JSON] Ошибка разбора JSON");
    return;
  }

  const char* command = doc["command"];
  if(strcmp(command, "deactivatealarm") == 0) {
    alarmActive = false;
    cycleMode = false;
    singleChannel = -1;
    Serial.println("[ALARM] Все каналы отключены");
    return;
  }

  if(strcmp(command, "activatealarm") == 0) {
    if(doc["channel"].is<JsonArray>()) {
      // режим с чередованием каналов и задержками
      JsonArray arr = doc["channel"].as<JsonArray>();
      channelCount = 0;
      for(size_t i = 0; i + 1 < arr.size() && channelCount < 10; i += 2) {
        channels[channelCount].channel = arr[i];
        channels[channelCount].delayMs = arr[i + 1];
        channelCount++;
      }
      currentIndex = 0;
      lastSwitch = millis();
      channelOn = false;
      cycleMode = true;
      alarmActive = true;
      Serial.println("[ALARM] Активировано с последовательным циклом");
    } else {
      // одиночный канал
      singleChannel = doc["channel"];
      Serial.print("[ALARM] Активирован канал: ");
      Serial.println(singleChannel);
      alarmActive = true;
      cycleMode = false;
    }
  }
}

void updateAlarm() {
  if(!alarmActive) return;

  if(cycleMode && channelCount > 0) {
    unsigned long now = millis();
    if(!channelOn || now - lastSwitch >= channels[currentIndex].delayMs) {
      if(channelOn) {
        Serial.print("[ALARM] Выключаем канал: ");
        Serial.println(channels[currentIndex].channel);
        currentIndex++;
        if(currentIndex >= channelCount) currentIndex = 0;
      }

      Serial.print("[ALARM] Включаем канал: ");
      Serial.println(channels[currentIndex].channel);
      lastSwitch = now;
      channelOn = true;
    }
  } else if(!cycleMode && singleChannel != -1) {
    // одиночный канал включен, ничего не делаем, просто держим
    // можно здесь добавить проверку состояния реле, если будет подключено
  }
}
