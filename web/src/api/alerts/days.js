import { fetchWithAuth } from "../fetchWithAuth";

export async function daysListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/days", { method: "GET" }, logout, navigate);
}