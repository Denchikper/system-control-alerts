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
  // Проверяем токен заранее
  if (!isTokenValid(token)) {
    console.warn("Токен недействителен, выполняем logout");
    if (logout) logout();
    if (navigate) navigate("/login"); // или window.location.reload()
    return null; // отменяем запрос
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

    if (res.status === 401) {
      console.warn("Токен стал недействительным во время запроса, выполняем logout");
      if (logout) logout();
      if (navigate) navigate("/login");
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Ошибка сервера: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("Ошибка при fetchWithAuth:", err);
    return null;
  }
}
