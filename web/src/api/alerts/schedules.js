import { fetchWithAuth } from "../fetchWithAuth";

export async function schedulesListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", { method: "GET" }, logout, navigate);
}

export async function schedulesActiveListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules/active", { method: "GET" }, logout, navigate);
}

export async function activateSchedule(token, schedulesId, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/schedules/activate/${schedulesId}`, {
    method: "PUT"
  }, logout, navigate);
}

export async function schedulesCreate(token, schedulesData, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", {
    method: "POST",
    body: JSON.stringify(schedulesData)
  }, logout, navigate);
}

export async function schedulesUpdate(token, schedulesData, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", {
    method: "PUT",
    body: JSON.stringify(schedulesData)
  }, logout, navigate);
}