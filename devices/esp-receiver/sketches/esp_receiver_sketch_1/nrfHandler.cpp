#include "nrfHandler.h"

static SPIClass mySPI(HSPI);
static RF24 radio(4, 2); // CE и CSN будут заменены в init
static const byte address[6] = "00001";

void initNRF(uint8_t ce, uint8_t csn, uint8_t sck, uint8_t mosi, uint8_t miso) {
    radio = RF24(ce, csn);
    mySPI.begin(sck, miso, mosi, csn);

    if(!radio.begin(&mySPI)) {
        // если не удалось инициализировать, зависаем
        while(true);
    }

    radio.openReadingPipe(0, address);
    radio.setPALevel(RF24_PA_LOW);
    radio.startListening();
}

void pollNRF(void (*onReceive)(const char* data)) {
    if(radio.available()) {
        char buf[32] = {0};
        radio.read(&buf, sizeof(buf));

        // вызываем callback
        if(onReceive) onReceive(buf);
    }
}