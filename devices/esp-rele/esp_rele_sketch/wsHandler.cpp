#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"
#include <ArduinoJson.h>
#include <ArduinoWebsockets.h>

using namespace websockets;

WebsocketsClient client;
const char* ws_server = "ws://192.168.1.99:2255";
const char* NameDevice = "WT32-ETH01_Relay_device";

unsigned long lastPing = 0;
unsigned long lastReconnectAttempt = 0;
bool isRegistered = false;  // Флаг регистрации

// -------------------- Обработка сообщений --------------------
void handleMessage(WebsocketsMessage message) {
  Serial.println("[WS] Received: " + message.data());

  StaticJsonDocument<200> doc;
  deserializeJson(doc, message.data());
  String type = doc["type"];

  if(type == "registered") {
    isRegistered = true; // успешно зарегистрировались
    Serial.println("[WS] Регистрация успешна");
    return;
  }

  if(type == "ping") {
    return; // сервер может присылать ping
  }

  handleAlarmCommand(message.data());
}

// -------------------- Отправка ping --------------------
void sendPing() {
  StaticJsonDocument<100> doc;
  doc["type"] = "ping";
  String json;
  serializeJson(doc, json);
  client.send(json);
}

// -------------------- Подключение к серверу --------------------
void connectToServer() {
  Serial.println("[WS] Подключение...");
  if(client.connect(ws_server)) {
    Serial.println("[WS] Подключено");

    // Отправляем регистрацию только если ещё не зарегистрированы
    if(!isRegistered) {
      StaticJsonDocument<200> doc;
      doc["type"] = "register";
      doc["nameDevice"] = NameDevice;
      String json;
      serializeJson(doc, json);
      client.send(json);
      Serial.println("[WS] Запрос регистрации отправлен: " + json);
    }
  } else {
    Serial.println("[WS] Не удалось подключиться, попытка через 5с");
  }
}

// -------------------- Основной цикл обработки WS --------------------
void pollWS() {
  client.poll();
  client.onMessage(handleMessage);

  // Отправка ping каждые 10 секунд
  if(millis() - lastPing > 10000) {
    sendPing();
    lastPing = millis();
  }

  // Если соединение потеряно, сбрасываем флаг регистрации и переподключаемся
  if(!client.available()) {
    isRegistered = false;  // сброс флага, чтобы при reconnect отправился register

    unsigned long now = millis();
    if(now - lastReconnectAttempt > 5000) {
      Serial.println("[WS] Переподключение...");
      connectToServer();
      lastReconnectAttempt = now;
    }
  }
}
