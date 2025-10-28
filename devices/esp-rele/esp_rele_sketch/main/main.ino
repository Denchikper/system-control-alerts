#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"

// --------- Настройки Ethernet ---------
IPAddress local_IP(192, 168, 1, 122);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(192, 168, 1, 1);
IPAddress secondaryDNS(8, 8, 8, 8);

void WiFiEvent(arduino_event_id_t event) {
  if(event == ARDUINO_EVENT_ETH_GOT_IP) {
    Serial.print("[ETH] Получен IP: "); Serial.println(ETH.localIP());
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.onEvent(WiFiEvent);

  ETH.begin();
  ETH.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);

  while(!ETH.linkUp()) { delay(100); }
  Serial.println("Link UP, IP: " + String(ETH.localIP()));

  connectToServer();
}

void loop() {
  pollWS();       // обработка WebSocket
  updateAlarm();  // чередование каналов / одиночный канал
  delay(50);
}
