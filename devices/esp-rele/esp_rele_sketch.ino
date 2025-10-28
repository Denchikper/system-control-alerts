#include <ETH.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

using namespace websockets;

// --------- Настройки Ethernet ---------
IPAddress local_IP(192, 168, 1, 122);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(192, 168, 1, 1);
IPAddress secondaryDNS(8, 8, 8, 8);

// --------- WebSocket ---------
WebsocketsClient client;
const char* ws_server = "ws://192.168.1.99:2255";
const char* NameDevice = "Relay_device";

// --------- Управление каналами ---------
bool alarmActive = false;
bool multipleChannels = false;
unsigned long lastSwitch = 0;
int currentIndex = 0;
int switchInterval = 1000; // ms между переключениями

int channels[10]; // массив каналов для чередования
int channelsCount = 0;

// --------- Приём сообщений ---------
void handleMessage(WebsocketsMessage message) {
  Serial.println("[WS] Received: " + message.data());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, message.data());
  if(error) {
    Serial.println("[JSON] Ошибка разбора JSON");
    return;
  }

  String command = doc["command"] | "";
  
  if(command == "deactivatealarm") {
    alarmActive = false;
    multipleChannels = false;
    Serial.println("[ALARM] Все каналы деактивированы");
  } 
  else if(command == "activatealarm") {
    alarmActive = true;

    if(doc["channel"].is<JsonArray>()) {
      // Массив каналов
      JsonArray arr = doc["channel"].as<JsonArray>();
      channelsCount = arr.size();
      for(int i=0; i<channelsCount; i++) {
        channels[i] = arr[i].as<int>();
      }
      multipleChannels = true;
      currentIndex = 0;
      lastSwitch = millis();
      Serial.println("[ALARM] Множественные каналы активны");
    } else {
      // Один канал
      int ch = doc["channel"] | -1;
      multipleChannels = false;
      Serial.print("[ALARM] Активируем канал: "); Serial.println(ch);
    }
  }
}

unsigned long lastPing = 0;
void sendPing() {
  StaticJsonDocument<100> doc;
  doc["type"] = "ping";
  String json;
  serializeJson(doc, json);
  client.send(json);
}

// --------- Подключение к серверу ---------
void connectToServer() {
  Serial.println("[WS] Подключение...");
  if(client.connect(ws_server)) {
    Serial.println("[WS] Подключено");

    // регистрация
    StaticJsonDocument<200> doc;
    doc["type"] = "register";
    doc["nameDevice"] = NameDevice;
    String json;
    serializeJson(doc, json);
    client.send(json);
    Serial.println("[WS] Запрос отправлен: " + json);
  } else {
    Serial.println("[WS] Не удалось подключиться, попытка через 5с");
    delay(5000);
  }
}

// --------- Ethernet статус ---------
void printEthStatus() {
  Serial.print("Link: "); Serial.println(ETH.linkUp() ? "UP" : "DOWN");
  Serial.print("IP: "); Serial.println(ETH.localIP());
}

void WiFiEvent(arduino_event_id_t event) {
  if(event == ARDUINO_EVENT_ETH_GOT_IP) {
    Serial.print("[ETH] Получен IP: "); Serial.println(ETH.localIP());
  }
}

// --------- Setup ---------
void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.onEvent(WiFiEvent);

  ETH.begin();
  ETH.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);

  while(!ETH.linkUp()) { delay(100); }
  printEthStatus();

  connectToServer();
}

// --------- Loop ---------
unsigned long lastReconnectAttempt = 0;
void loop() {
  client.poll();
  client.onMessage(handleMessage);

  // Пинг
  if(millis() - lastPing > 10000) {
    sendPing();
    lastPing = millis();
  }

  // Переподключение
  if(!client.available()) {
    unsigned long now = millis();
    if(now - lastReconnectAttempt > 5000) {
      Serial.println("[WS] Переподключение...");
      connectToServer();
      lastReconnectAttempt = now;
    }
  }

  // Обработка множественных каналов
  if(alarmActive && multipleChannels && channelsCount>0) {
    if(millis() - lastSwitch > switchInterval) {
      Serial.print("[ALARM] Активен канал: "); 
      Serial.println(channels[currentIndex]);
      currentIndex++;
      if(currentIndex >= channelsCount) currentIndex = 0;
      lastSwitch = millis();
    }
  }

  delay(50);
}
