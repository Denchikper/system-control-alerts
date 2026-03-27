# Система управления звуковыми оповещениями

## Структура

```bash
system-conrtol-alerts/
├── server/                    # Backend (Node.js + Express + WS)
├── web/                       # Frontend (React + Vite)
├── devices/                   # Прошивки и схемы устройств
├── docs/                      # Документация
├── docker-compose.yaml        # Обычный Docker запуск
├── docker-compose.hostnet.yaml# Linux host network запуск
├── .env.example               # Пример переменных окружения
└── README.md
```

## Переменные окружения

Создайте корневой `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Основные параметры:

```env
DATABASE_HOST=host.docker.internal
DATABASE_NAME=system_control_alerts
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432

SERVER_PORT=2255
WEB_PORT=3000
VITE_API_URL=/api

JWT_SECRET=change-me
WS_HEARTBEAT_DEVICES_INTERVAL=30000
```

## Docker

### Обычный запуск

Запуск сборки и контейнеров:

```bash
docker compose up --build
```

Запуск в фоне:

```bash
docker compose up --build -d
```

Пересобрать все образы:

```bash
docker compose build
```

Пересобрать только backend:

```bash
docker compose build server
```

Пересобрать только frontend:

```bash
docker compose build web
```

Остановить контейнеры:

```bash
docker compose down
```

Остановить контейнеры и удалить volume:

```bash
docker compose down -v
```

Логи всех сервисов:

```bash
docker compose logs -f
```

Логи backend:

```bash
docker compose logs -f server
```

Логи frontend:

```bash
docker compose logs -f web
```

### Linux host network

Этот режим нужен для Linux-хоста, если backend должен видеть реальный IP подключающихся устройств.

Запуск:

```bash
docker compose -f docker-compose.hostnet.yaml up --build
```

Запуск в фоне:

```bash
docker compose -f docker-compose.hostnet.yaml up --build -d
```

Остановить:

```bash
docker compose -f docker-compose.hostnet.yaml down
```

Остановить и удалить volume:

```bash
docker compose -f docker-compose.hostnet.yaml down -v
```

Логи:

```bash
docker compose -f docker-compose.hostnet.yaml logs -f
```

### GitHub Packages / GHCR

В репозитории есть workflow:

`[.github/workflows/publish-ghcr.yml](/d:/Development/system-conrtol-alerts/.github/workflows/publish-ghcr.yml)`

Что он делает:

- на `push` в `main` собирает `server` и `web`
- публикует Docker-образы в `ghcr.io`
- на тегах `v*` публикует тегированные образы
- на `pull_request` только проверяет сборку без публикации

Имена образов:

- `ghcr.io/<owner>/system-control-alerts-server`
- `ghcr.io/<owner>/system-control-alerts-web`

Запуск из готовых образов GHCR:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Что нужно для работы CI/CD

- репозиторий должен быть на GitHub
- workflow запускается после `push` в `main`
- публикация идёт в `ghcr.io` через встроенный `GITHUB_TOKEN`
- образы публикуются автоматически, отдельный ручной логин в workflow не нужен

#### Какие образы публикуются

- backend: `ghcr.io/<owner>/system-control-alerts-server`
- frontend: `ghcr.io/<owner>/system-control-alerts-web`

`latest` публикуется для default branch, также создаются теги по branch/tag/sha.

#### Как обновлять сервер из GHCR

После публикации новой версии на сервере достаточно выполнить:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Ручное обновление сервера

Если сервер доступен только из локальной сети, рабочая схема такая:

1. Вы пушите изменения в `main`
2. GitHub Actions публикует новые образы в `ghcr.io`
3. Вы заходите на сервер вручную
4. В папке проекта выполняете:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

Что делают команды:

- `docker compose -f docker-compose.ghcr.yaml pull` скачивает свежие образы `server` и `web`
- `docker compose -f docker-compose.ghcr.yaml up -d` перезапускает контейнеры на новых образах

Если образы в GHCR приватные, на сервере нужно один раз выполнить:

```bash
docker login ghcr.io
```

Если нужно пересоздать контейнеры принудительно:

```bash
docker compose -f docker-compose.ghcr.yaml down
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Полезный сценарий релиза

1. Внести изменения в `server` или `web`
2. Запушить в `main`
3. Дождаться завершения workflow `Publish Docker Images`
4. На сервере выполнить `docker compose -f docker-compose.ghcr.yaml pull`
5. На сервере выполнить `docker compose -f docker-compose.ghcr.yaml up -d`

#### Что использовать для деплоя

- для локальной сборки и тестов: `docker-compose.yaml`
- для Linux с реальным IP устройств: `docker-compose.hostnet.yaml`
- для запуска уже опубликованных образов из GitHub Packages: `docker-compose.ghcr.yaml`

## Доступ после запуска

- Frontend: `http://localhost:3000`
- Backend API и WebSocket: `http://localhost:2255`
- Устройства подключаются к backend напрямую по `ws://<host>:2255`

## Примечания

- В обычном Docker-режиме backend может видеть IP клиента как адрес docker bridge, а не реальный IP устройства.
- Для работы с реальным source IP используйте Linux и `docker-compose.hostnet.yaml`.
- Backend обращается к устройствам по IP из базы как обычный сетевой клиент, поэтому доступ к устройствам в LAN должен быть открыт с машины, где запущен Docker.
