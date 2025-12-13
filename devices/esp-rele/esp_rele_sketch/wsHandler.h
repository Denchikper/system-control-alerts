#ifndef WSHANDLER_H
#define WSHANDLER_H

#include <ArduinoWebsockets.h>
using namespace websockets;

void pollWS();
void connectToServer(const char* ip_server);

#endif