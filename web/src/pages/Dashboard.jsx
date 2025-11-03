import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/NavBar.jsx";
import ClockBar from "../components/ClockBar.jsx";
import SystemStatus from "../components/SystemStatus.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  useEffect(() => {
      document.title = "Панель управления | СУЗО";
  }, []);

return (
    <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200">
      <Navbar />

      <div className="flex flex-1 px-6 py-4 space-x-6">
        <SystemStatus />
        <div className="flex-1 bg-[#11141A] rounded-2xl p-6 shadow-lg">
          {/* Основная область */}
          <h2 className="text-xl font-semibold mb-4">Главная</h2>
          <p>Здесь будет информация о тревогах и оповещениях.</p>
        </div>
      </div>
    </div>
  );
}
