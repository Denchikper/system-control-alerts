#include "nrfHandler.h"

static SPIClass mySPI(HSPI);
static RF24 radio(4, 2); // CE и CSN будут заменены в init
static const byte address[6] = "00001";
static String incomingBuffer = "";

void initNRF(uint8_t ce, uint8_t csn, uint8_t sck, uint8_t mosi, uint8_t miso) {
    radio = RF24(ce, csn);
    mySPI.begin(sck, miso, mosi, csn);

    if(!radio.begin(&mySPI)) {
        // если не удалось инициализировать, зависаем
        while(true);
    }
    radio.setChannel(0x6e);
    radio.openReadingPipe(0, address);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
    radio.startListening();
}

void pollNRF(void (*onReceive)(const char* data, size_t len)) {
    while (radio.available()) {
        char buf[32] = {0};
        uint8_t len = radio.getDynamicPayloadSize();
        if(len > sizeof(buf)) len = sizeof(buf);

        radio.read(buf, len);

        // Добавляем в общий буфер
        incomingBuffer += String(buf).substring(0, len);

        // Ищем конец JSON (можно по закрывающей скобке '}' или по '\n' если отправляем через Serial)
        int endIdx = incomingBuffer.indexOf('}'); // считаем, что JSON валидный и заканчивается '}'
        while (endIdx != -1) {
            String packet = incomingBuffer.substring(0, endIdx + 1);
            incomingBuffer = incomingBuffer.substring(endIdx + 1);

            // Передаём полный JSON в колбэк
            if(onReceive) onReceive(packet.c_str(), packet.length());

            endIdx = incomingBuffer.indexOf('}');
        }
    }
}