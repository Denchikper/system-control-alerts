import { fetchWithAuth } from "../fetchWithAuth";

export async function eventsGet(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/events/${id}`, { method: "GET" }, logout, navigate);
}

export async function deleteEventsByID(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/events/${id}`, { method: "DELETE" }, logout, navigate);
}

export async function eventsCreate(token, scenario_id, event_order, start_time, end_time, logout, navigate) {
  const scenariosData = {scenario_id, event_order, start_time, end_time}
  return await fetchWithAuth(token, "/alerts/events", {
    method: "POST",
    body: JSON.stringify(scenariosData)
  }, logout, navigate);
}