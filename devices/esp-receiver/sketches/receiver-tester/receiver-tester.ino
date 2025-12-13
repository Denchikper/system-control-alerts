#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// ====== Пины nRF24 для Arduino Nano ======
#define NRF_CE   9
#define NRF_CSN  10

RF24 radio(NRF_CE, NRF_CSN);

// Адрес для отправки (5 байт)
const byte address[6] = "00001";

void setup() {
  Serial.begin(9600);
  while (!Serial); // ждем Serial Monitor

  // Инициализация nRF24
  if (!radio.begin()) {
    Serial.println("nRF24 init failed");
    while (1); // зависаем если не удалось
  }

  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_LOW);
  radio.stopListening(); // режим передачи

  Serial.println("nRF24 ready. Введите сообщение для отправки:");
}

void loop() {
  // Проверяем, есть ли данные в Serial
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n'); // читаем строку
    input.trim();
    if (input.length() > 0) {
      bool ok = radio.write(input.c_str(), input.length() + 1);
      Serial.print("Отправлено: ");
      Serial.print(input);
      Serial.print(" | Статус: ");
      Serial.println(ok ? "OK" : "FAILED");
    }
  }
}