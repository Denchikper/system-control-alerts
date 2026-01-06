# 🔔 Система управления звуковыми оповещениями 

[![Version](https://img.shields.io/badge/version-1.2.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 📋 Предварительные требования
Перед началом убедитесь, что на вашей системе установлено:

* Node.js (версия 18 или выше) — [Скачать](https://nodejs.org/en/download)
* npm (обычно поставляется с Node.js) или yarn
* cross-env - установите его с помощью команды **npm install cross-env -g** или **yarn global add cross-env**

## 📁 Структура проекта
```bash
system-conrtol-alerts/
├── devices/
│   ├── esp-receiver/         # Файлы для разработанного приемника
│   ├── esp-rele/             # Файлы для разработанного устройства-реле  
│   ├── remote-controller/    # Файлы для разработанного устройства-пульта
│   ├── test_sketches/        # Тестовые скетчи
│   └── README.md             # Описание устройств и приемника
├── docs/                     # Документация необходимая для разработки проекта
├── sounds/                   # Аудиофайлы
├── server/                   # Backend (Node.js)
│   ├── src/                  # Исходный код сервера
│   ├── logs/                 # Логи сервера (для отладки)
│   ├── node_modules/         # Зависимости сервера
│   ├── env.development       # Переменные окружения для разработки
│   ├── env.example           # Пример переменных окружения
│   ├── env.production        # Переменные окружения для продакшена
│   ├── .gitignore            # Git-игнор для сервера
│   ├── ecosystem.config.js   # Конфиг PM2 (для деплоя)
│   ├── nodemon.json          # Конфиг Nodemon
│   ├── package.json          # Зависимости и скрипты сервера
│   ├── package-lock.json     # Лок-файл зависимостей сервера
│   ├── README.md             # Документация сервера
│   └── server.js             # Точка входа сервера
├── web/                      # Frontend (Vite + Tailwind CSS)
│   ├── src/                  # Исходный код фронтенда
│   ├── public/               # Статические файлы фронтенда
│   ├── node_modules/         # Зависимости фронтенда
│   ├── env.development       # Переменные окружения фронтенда (dev)
│   ├── env.example           # Пример переменных фронтенда
│   ├── env.production        # Переменные окружения фронтенда (prod)
│   ├── .gitignore            # Git-игнор для фронтенда
│   ├── eslint.config.js      # Конфиг ESLint
│   ├── index.html            # Главный HTML-файл
│   ├── package.json          # Зависимости и скрипты фронтенда
│   ├── package-lock.json     # Лок-файл зависимостей фронтенда
│   ├── README.md             # Документация фронтенда
│   ├── postcss.config.js     # Конфиг PostCSS
│   ├── tailwind.config.js    # Конфиг Tailwind CSS
│   └── vite.config.js        # Конфиг Vite
├── .gitignore                # Общий gitignore для всего проекта
├── LICENSE                   # Лицензия проекта
├── package.json              # Корневой package.json
├── package-lock.json         # Корневой лок-файл
└── README.md                 # Общая документация проекта
```

## 📶 Запуск проекта

### 1. Клонирование репозитория
```bash
git clone https://github.com/Denchikper/system-control-alerts.git
cd system-control-alerts
```
### 2. Сервер
#### 2.1. Установка зависимостей
```bash
cd server
npm install
# или
cd server 
yarn install
```

#### 2.2. Настройка переменных окружения
Создайте файл .env в корне проекта на основе примера:
```bash
cp .env.example .env.development
cp .env.example .env.production
```
Отредактируйте __.env.development__ и __.env.development__ файлы, указав необходимые ключи (API, база данных и т.д.). 

#### 2.3. Запуск в режиме разработки
```bash
npm run dev
# или
yarn dev
```
#### 2.4. Запуск в режиме продакшна
```bash
npm run start
# или
yarn start
```
### 3. Веб-приложение
#### 3.1. Установка зависимостей
```bash
cd web
npm install
# или
cd web
yarn install
```

#### 3.2. Настройка переменных окружения веб-приложения
Создайте файл .env в корне проекта на основе примера:
```bash
cp .env.example .env.development
cp .env.example .env.production
```
Отредактируйте __.env.development__ и __.env.development__ файлы, указав необходимые ключи (API, база данных и т.д.). 

#### 3.3. Запуск в режиме разработки
```bash
npm run dev
# или
yarn dev
```
#### 3.4. Запуск в режиме продакшна
```bash
npm run build:prod
# или
yarn build:prod
```


## 📄 Лицензия
Этот проект распространяется под лицензией [Academic Free License v3.0](https://github.com/Denchikper/system-control-alerts/blob/main/LICENSE).