<table>
  <tr>
    <td>
      <img src="./web/public/Frame 423.png" alt="Логотип" width="80"/>
    </td>
    <td>
      <h1>Система управления звуковыми оповещениями</h1>
    </td>
  </tr>
</table>


## 🖊️ Описание:   
...

---

## 🛠 Технологии
- **Frontend:** HTML, CSS, JavaScript, Vite.js
- **Backend:** Node.js, Express.js, Sequelize, PostgreSQL  
- **WebSocket:** Реальное управление устройствами через ws-соединение  
- **Логирование:** Winston с кастомными уровнями логов
- **Модели БД:** Alarm, User, Devices, ScheduleItems, AlertPlanned, Channels, Break, Day, Lesson, Schedule, 

---

## ⚙️ Функционал

...

---

## 🗂 Структура проекта

...

## Команды для управления устроустройствами

### 🔵 Активировать тревогу

- /api/alarm/activate

```json
{
  "id": (id тревоги)
}
```

### 🔵 Деактивировать тревогу

- /api/alarm/deactivate
