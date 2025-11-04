#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"

// --------- Настройки Ethernet ---------
IPAddress local_IP(192, 168, 1, 122);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(192, 168, 1, 1);
IPAddress secondaryDNS(8, 8, 8, 8);

void setup() {
  delay(1000);

  ETH.begin();
  ETH.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);

  while(!ETH.linkUp()) { delay(100); }

  setupAlarm();
  connectToServer();
}

void loop() {
  pollWS();       // обработка WebSocket
  updateAlarm();  // чередование каналов / одиночный канал
  delay(50);
}
