import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div>Загрузка...</div>; // пока проверяем токен

  if (!token) return <Navigate to="/" replace />; // если нет токена → логин

  return children; // токен есть → показываем страницу
}
