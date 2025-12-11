#ifndef WSHANDLER_H
#define WSHANDLER_H

#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
using namespace websockets;

extern WebsocketsClient client;

void pollWS();
void connectToServer(const char* ip_server);
void handleMessage(WebsocketsMessage message);

#endif