import { fetchWithAuth } from "../fetchWithAuth";

export async function getPermissionCatalog(token, logout, navigate) {
  return await fetchWithAuth(token, "/user/permissions/catalog", { method: "GET" }, logout, navigate);
}
