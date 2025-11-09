#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"

// --------- Настройки Ethernet ---------
IPAddress local_IP(172, 16, 7, 102);
IPAddress gateway(172, 16, 4, 2);
IPAddress subnet(255, 255, 248, 0);
IPAddress primaryDNS(172, 16, 4, 2);
IPAddress secondaryDNS(8,8,8,8);

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
