#include <Wire.h> 
#define _LCD_TYPE 1
#include <LCD_1602_RUS_ALL.h>
#include <EncButton.h>
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include <ArduinoJson.h>

// ---------------- DISPLAY ----------------
LCD_1602_RUS lcd(0x27, 16, 2);

// ---------------- ENCODER ----------------
#define ENC_S1 2
#define ENC_S2 3
#define ENC_KEY 4

EncButton enc(ENC_S1, ENC_S2, ENC_KEY);

// ---------------- NRF2491+ ----------------
#define CE_PIN 9
#define CSN_PIN 10

RF24 radio(CE_PIN, CSN_PIN);

const rf24_datarate_e dataRate = RF24_250KBPS;
const rf24_pa_dbm_e PALevel = RF24_PA_MAX;
const uint8_t channel = 0x6E;

const byte address[6] = "00001";

// ---------------- MENU STATES ----------------
enum MenuState { MENU_MAIN, MENU_ALARM, MENU_TYPE, MENU_CODE };
MenuState state = MENU_MAIN;

int menuIndex = 0;           
int viewStart = 0;           

// ---------------- CODE INPUT ----------------
int codePos = 0;
int codeDigits[6] = {0,0,0,0,0,0};

// ---------------- SELECTED  ----------------
const char* selectedType = "trevoga";
const char* selectedAlarm = "fire";

// ---------------- MENU ITEMS ----------------
const char* mainMenu[] = { "AKTИBAЦИЯ", "ДEAKTИBAЦИЯ" };
const char* alarmMenu[] = { "ПOЖAP", "BO3ДУX", "PAKETA", "XИMИЯ", "HAЗAД" };
const char* typeMenu[] = { "TPEBOГA", "TPEНИPOBKA", "HAЗAД" };

// -------------- CUSTOM ICONS -----------------
byte bell[]  = {0x4, 0xe, 0xe, 0xe, 0x1f, 0x0, 0x4};


// ---------------- SETUP ----------------
void setup() {
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.createChar(0, bell);
  lcd.setCursor(0,0);
  lcd.write(0);
  lcd.print("    CYZO-01   ");
  lcd.write(0);

  for (int i = 0; i < 16; i++) {
    lcd.setCursor(i, 1);
    lcd.print("-");
    delay(150);
  } 

  delay(2000);
  showMenu();

  // ---------------- Инициализация NRF ----------------
  radio.begin();
  radio.setChannel(channel);
  radio.setPALevel(PALevel);
  radio.setDataRate(dataRate);
  radio.openWritingPipe(address);
  radio.stopListening();
}

// ---------------- LOOP ----------------
void loop() {
  enc.tick();

// --------- Обработка поворота ----------
  if(enc.turn()) {
    int dir = -enc.dir(); 
    if(state == MENU_CODE){
      codeDigits[codePos] += dir;
      if(codeDigits[codePos] < 0) codeDigits[codePos] = 9;
      if(codeDigits[codePos] > 9) codeDigits[codePos] = 0;
      showCode();
    } else {
      menuIndex += dir;
      normalizeMenuIndex();
      showMenu();
    }
  }

// --------- Обработка нажатия ----------
  if(enc.press()) {
    selectMenu();
  }
}

// ---------------- MENU FUNCTIONS ----------------
void normalizeMenuIndex() {
  int maxIndex = 0;
  switch(state){
    case MENU_MAIN: maxIndex = 1; break;
    case MENU_ALARM: maxIndex = 4; break;
    case MENU_TYPE: maxIndex = 2; break;
    default: break;
  }

  if(menuIndex < 0) menuIndex = maxIndex;
  if(menuIndex > maxIndex) menuIndex = 0;

  if(menuIndex < viewStart) viewStart = menuIndex;
  if(menuIndex > viewStart + 1) viewStart = menuIndex - 1;
}

void showMenu() {
  lcd.clear();

  const char** currentMenu;
  int menuSize = 0;

  switch(state){
    case MENU_MAIN: currentMenu = mainMenu; menuSize = 2; break;
    case MENU_ALARM: currentMenu = alarmMenu; menuSize = 5; break;
    case MENU_TYPE: currentMenu = typeMenu; menuSize = 3; break;
    default: return;
  }

  for(int i=0;i<2;i++){
    int idx = viewStart + i;
    if(idx >= menuSize) break;
    lcd.setCursor(0,i);
    lcd.print(idx == menuIndex ? "> " : " ");
    lcd.print(currentMenu[idx]);
  }
}

void selectMenu() {
  switch(state){
    case MENU_MAIN:  // Главное меню
      if(menuIndex == 0){ // Активация
        state = MENU_ALARM;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      } else { // Деактивация
        sendCommand("deactivate", "all", "all", "000000");
        delay(2000);
        state = MENU_MAIN;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      }

      break;

    case MENU_ALARM:  // Меню с оповещениями
      if(menuIndex == 0) {
        selectedAlarm = "fire";
        state = MENU_TYPE;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      } else if(menuIndex == 1) {
        selectedAlarm = "vozduh";
        state = MENU_TYPE;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
        
      } else if(menuIndex == 2) {
        selectedAlarm = "rocket";
        state = MENU_TYPE;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
        
      } else if(menuIndex == 3) {
        selectedAlarm = "chemical";
        state = MENU_TYPE;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
        
      } else { // NAZAD
        state = MENU_MAIN;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      }

      break;

    case MENU_TYPE:  // Меню с типами оповещений
      if(menuIndex == 0){ // Tревога
        selectedType = "trevoga";
        state = MENU_CODE;
        codePos = 0;
        for(int i=0;i<6;i++) codeDigits[i]=0;
        showCode();
      } else if(menuIndex == 1){ // Tренировка
        selectedType = "trenirovka";
        state = MENU_CODE;
        codePos = 0;
        for(int i=0;i<6;i++) codeDigits[i]=0;
        showCode();
      } else { // NAZAD
        state = MENU_ALARM;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      }

      break;

    case MENU_CODE:
      codePos++;
      if(codePos > 5){
        char codeStr[8];
        for(int i=0;i<6;i++) codeStr[i] = '0' + codeDigits[i];
        codeStr[6] = '\0';

        sendCommand("activate", selectedAlarm, selectedType, codeStr);

        delay(2000);

        state = MENU_MAIN;
        menuIndex = 0;
        viewStart = 0;
        showMenu();
      } else {
        showCode();
      }

      break;
  }
}

// ---------------- CODE DISPLAY ----------------
void showCode() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("KOД: "); 

  for(int i = 0; i < 6; i++) {
    if(i == 3) lcd.print("-");
    char buf[2];
    buf[0] = '0' + codeDigits[i]; 
    buf[1] = '\0';
    lcd.print(buf);
  }

  lcd.setCursor(5 + codePos + (codePos >= 3 ? 1 : 0), 1); 
  lcd.print("^");
}

// ---------------- NRF24 SEND FUNCTION ----------------
void sendCommand(const char* command, const char* alarm, const char* typeAlarm, const char* code) {
  StaticJsonDocument<200> doc;
  doc["command"] = command;
  doc["alarm"] = alarm;
  doc["typeAlarm"] = typeAlarm;
  doc["code"] = code;

  char buffer[128];
  size_t len = serializeJson(doc, buffer);
  size_t sent = 0;

  while (sent < len) {
    size_t chunk = min((size_t)32, len - sent);
    bool ok = radio.write(buffer + sent, chunk);
    if (!ok) {
        lcd.clear();
        for (int i = 0; i < 16; i++) {
          lcd.setCursor(i, 1);
          lcd.print("-");
          delay(150);
        } 
      lcd.setCursor(0,0);
      lcd.print("OШИБKA ПEPEДAЧИ");
      return;
    }

    sent += chunk;

    delay(3);
  }

  lcd.clear();

  for (int i = 0; i < 16; i++) {
    lcd.setCursor(i, 1);
    lcd.print("-");
    delay(100);
  }

  lcd.setCursor(0,0);
  lcd.print("OTПPABЛEHO");
}