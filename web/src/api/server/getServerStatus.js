// src/api/system.js
import { fetchWithAuth } from "../fetchWithAuth";

export async function getServerStatus(token, logout, navigate) {
  try {
    const data = await fetchWithAuth(token, "/server/server-status", { method: "GET" }, logout, navigate);
    if(data) {
      const activeAlarm = data.activeAlarm ? data.activeAlarm.name : "Нет активных тревог";
      return {
        devicesList: data.devicesList,
        activeAlarm,
        serverConnected: true, // сервер реально подключен
        };
    }
  } catch (err) {
    console.error("Ошибка при получении статуса сервера:", err.message);
    return {
      devicesList:  [],
      serverConnected: false, // сервер недоступен
      activeAlarm: "Нет активных тревог",
    };
  }
}
