// src/api/time.js
import { fetchWithAuth } from "../fetchWithAuth";

export async function getServerTime(token, logout, navigate) {
  const data = await fetchWithAuth(token, "/server/server-time", { method: "GET" }, logout, navigate);
  if (!data?.data.serverTime) return { hours: 0, minutes: 0, seconds: 0, date: new Date() };

  const serverDate = new Date(data.data.serverTime);

  return {
    hours: serverDate.getHours(),
    minutes: serverDate.getMinutes(),
    seconds: serverDate.getSeconds(),
    date: serverDate,
  };
}
