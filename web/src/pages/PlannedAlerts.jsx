import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SchoolTab from "../components/Alerts/schoolTab.jsx";
import PlannedTab from "../components/Alerts/PlannedTab.jsx";

export default function PlannedAlertsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [plannedAlerts, setPlannedAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Запланированные оповещения | СУЗО";
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200">
      <Navbar />
      <div className="flex-1 flex flex-col items-center p-6">

        {/* Переключатель по центру */}
        <div className="mb-8">
          <div className="inline-flex bg-[#161B22] rounded-xl p-1">
            <button
              onClick={() => setActiveTab("school")}
              className={`px-5 py-2 rounded-lg text-sm transition
                ${activeTab === "school" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white" }`}
            >
              Школьные звонки
            </button>

            <button
              onClick={() => setActiveTab("planned")}
              className={`px-5 py-2 rounded-lg text-sm transition
                ${activeTab === "planned" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white" }`}
            >
              Запланированные оповещения
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="w-full rounded-xl p-2">
          {loading && <p className="text-center text-gray-400">Загрузка...</p>}

          {activeTab === "school" && !loading && (
            <SchoolTab token={token} logout={logout} navigate={navigate}/>
          )}

          {activeTab === "planned" && !loading && (
            <PlannedTab plannedAlerts={plannedAlerts} />
          )}
        </div>
      </div>
    </div>
  );
}
