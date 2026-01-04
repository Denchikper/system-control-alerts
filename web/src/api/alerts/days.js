import { fetchWithAuth } from "../fetchWithAuth";

export async function daysListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/days", { method: "GET" }, logout, navigate);
}


export async function schedulesUpdate(token, schedulesData, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", {
    method: "PUT",
    body: JSON.stringify(schedulesData)
  }, logout, navigate);
}