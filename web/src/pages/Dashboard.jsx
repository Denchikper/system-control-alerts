import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  useEffect(() => {
      document.title = "Панель управления | СУЗО";
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0E1117] text-gray-100 p-6">
      <header className="flex justify-between items-center border-b border-gray-700 pb-3">
        <h1 className="text-xl font-semibold">Панель управления</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white transition"
        >
          Выйти
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">Добро пожаловать, {user?.firstName || "пользователь"}!</p>
          <p className="text-gray-400">Ваш токен успешно сохранён 🔐</p>
        </div>
      </main>
    </div>
  );
}
