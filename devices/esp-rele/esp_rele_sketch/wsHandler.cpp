#include "wsHandler.h"
#include "alarmManager.h"
#include <ArduinoJson.h>
#include <ETH.h>
#include <ArduinoWebsockets.h>

using namespace websockets;

WebsocketsClient client;
const char* ws_server = "ws://192.168.1.99:2255";
const char* NameDevice = "Relay_device";

unsigned long lastPing = 0;
unsigned long lastReconnectAttempt = 0;

void handleMessage(WebsocketsMessage message) {
  Serial.println("[WS] Received: " + message.data());
  handleAlarmCommand(message.data());  // теперь String
}

void sendPing() {
  StaticJsonDocument<100> doc;
  doc["type"] = "ping";
  String json;
  serializeJson(doc, json);
  client.send(json);
}

void connectToServer() {
  Serial.println("[WS] Подключение...");
  if(client.connect(ws_server)) {
    Serial.println("[WS] Подключено");

    StaticJsonDocument<200> doc;
    doc["type"] = "register";
    doc["nameDevice"] = NameDevice;
    String json;
    serializeJson(doc, json);
    client.send(json);
    Serial.println("[WS] Запрос отправлен: " + json);
  } else {
    Serial.println("[WS] Не удалось подключиться, попытка через 5с");
  }
}

void pollWS() {
  client.poll();
  client.onMessage(handleMessage);

  if(millis() - lastPing > 10000) {
    sendPing();
    lastPing = millis();
  }

  if(!client.available()) {
    unsigned long now = millis();
    if(now - lastReconnectAttempt > 5000) {
      Serial.println("[WS] Переподключение...");
      connectToServer();
      lastReconnectAttempt = now;
    }
  }
}
