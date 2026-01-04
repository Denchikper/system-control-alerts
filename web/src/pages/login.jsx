import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ добавляем навигацию
import { loginUser } from "../api/auth"; // ✅ импорт API
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ инициализация навигации
  const { login } = useAuth();

  useEffect(() => {
    document.title = "Вход в систему | СУЗО";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);

      if (data.token) {
        login(data.token);
      }

      navigate("/dashboard")
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError(err.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200 relative">
      <header className="flex items-center justify-start px-6 py-2 border-b border-gray-700 select-none">
        <img
          src="/icon.png"
          alt="logo"
          className="w-10 h-10 mr-3 pointer-events-none select-none"
        />
        <div className="w-px h-8 bg-gray-700 mx-3"></div>
        <h1 className="text-[15px] font-semibold text-gray-100">
          Система управления звуковыми оповещениями
        </h1>
      </header>

      <main className="flex flex-1 justify-center items-center">
        <div className="bg-[#1A1F2C] p-8 rounded-2xl shadow-lg w-[360px]">
          <h2 className="text-2xl font-semibold mb-6 text-center">Вход</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="block mb-1 text-sm">Логин</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[#11141A] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[#11141A] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-2 rounded-md text-white font-medium transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </main>

      <footer className="absolute bottom-2 right-4 text-sm text-gray-500">
        Версия 1.0.0
      </footer>
    </div>
  );
}
