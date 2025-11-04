import { API_BASE_URL } from "../config";

// helper для проверки валидности JWT токена
function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp; // время истечения в секундах
    return Date.now() / 1000 < exp;
  } catch {
    return false;
  }
}

export async function fetchWithAuth(token, url, options = {}, logout, navigate) {
  if (!isTokenValid(token)) {
    if (logout) logout();
    if (navigate) navigate("/login");
    return { ok: false, status: 401, data: "Токен недействителен" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    let data;
    try { data = await res.json(); } catch { data = await res.text(); }

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    console.error("Ошибка при fetchWithAuth:", err);
    return { ok: false, status: 0, data: err.message };
  }
}