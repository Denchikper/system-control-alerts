#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"

#define DEV_PIN 36

bool isDev = false;
const char* ETH_HOSTNAME = "System-control-alerts-relay_device";


// Dev сеть
IPAddress dev_IP(192,168,1,122);
IPAddress dev_gateway(192,168,1,1);
IPAddress dev_subnet(255,255,255,0);
IPAddress dev_dns(192,168,1,1);

// Prod сеть
IPAddress prod_IP(172,16,7,102);
IPAddress prod_gateway(172,16,4,2);
IPAddress prod_subnet(255,255,248,0);
IPAddress prod_dns(172,16,4,2);

void setup() {
  delay(1000);

  pinMode(DEV_PIN, INPUT_PULLUP);
  isDev = (digitalRead(DEV_PIN) == LOW);

  ETH.begin();
  ETH.setHostname(ETH_HOSTNAME);

  if (isDev) {
    ETH.config(prod_IP, prod_gateway, prod_subnet, prod_dns, prod_dns);
  } else {
    ETH.config(prod_IP, prod_gateway, prod_subnet, prod_dns, prod_dns);
  }

  while(!ETH.linkUp()) delay(100);

  setupAlarm();

  if (isDev) {
    // connectToServer("ws://192.168.1.99:2255");
    connectToServer("ws://172.16.4.21:2255");
  } else {
    connectToServer("ws://172.16.4.21:2255");
  }
}

void loop() {
  pollWS();
  updateAlarm();
}