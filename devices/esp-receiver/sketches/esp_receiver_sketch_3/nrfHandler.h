#ifndef NRFHANDLER_H
#define NRFHANDLER_H

#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// Инициализация nRF24
void initNRF(uint8_t ce, uint8_t csn, uint8_t sck, uint8_t mosi, uint8_t miso);

// Проверка входящих сообщений, если есть, вызываем callback
void pollNRF(void (*onReceive)(const char* data, size_t len));

#endif