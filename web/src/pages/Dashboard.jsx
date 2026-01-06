import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SystemStatus from "../components/SystemStatus";
import AlarmControlPanel from "../components/AlarmControlPanel";

import { useNavigate } from "react-router-dom";
import ChangeDutyPanel from "../components/ChangeDutyPanel";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAlarm, setActiveAlarm] = useState("Нет активных тревог");
  // Получение тревог при загрузке страницы
  useEffect(() => {
    document.title = "Панель управления | СУЗО";
  }, []);


  return (
    <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200 overscroll-y-none">
      <Navbar />

      <div className="flex flex-1 px-6 py-4 space-x-6">
        <SystemStatus               
        token={token} 
        logout={logout}
        navigate={navigate}
        activeAlarm={activeAlarm}
        setActiveAlarm={setActiveAlarm}
        />

        <AlarmControlPanel
          token={token}
          logout={logout}
          navigate={navigate}
          setActiveAlarm={setActiveAlarm}
        />
        <ChangeDutyPanel
          token={token}
          logout={logout}
          navigate={navigate}
        />
      </div>
    </div>
  );
}
