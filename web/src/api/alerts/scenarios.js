import { fetchWithAuth } from "../fetchWithAuth";

export async function scenariosGet(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/scenarios/${id}`, { method: "GET" }, logout, navigate);
}

export async function scenariosCreate(token, scenariosData, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/scenarios", {
    method: "POST",
    body: JSON.stringify(scenariosData)
  }, logout, navigate);
}