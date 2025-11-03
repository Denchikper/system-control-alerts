import React, { useState, useEffect } from "react";
import { getServerStatus } from "../api/server/getServerStatus";
import ClockBar from "./ClockBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SystemStatus() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [devicesList, setDevicesList] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState("Нет активных тревог");
  const [serverConnected, setServerConnected] = useState(false); // новый флаг

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getServerStatus(token, logout, navigate);
      setDevicesList(status.devicesList ?? []);
      setActiveAlarm(status.activeAlarm);
      setServerConnected(status.serverConnected);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [token, logout, navigate]);

  return (
    <div className="bg-[#1A1F2C] p-6 rounded-2xl shadow-lg w-full max-w-sm text-gray-200">
      <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-2">Состояние системы</h2>

      <p className={`text-center text-sm font-medium mb-5 ${
        serverConnected ? "text-green-500" : "text-red-500"
      }`}>
        {serverConnected ? "Сервер подключен" : "Сервер недоступен"}
      </p>

      <div className="border-t border-gray-700 pt-3 mb-5">
        <ClockBar />
      </div>

      <div className="border-t border-gray-700 pt-3 mb-5">
        <p className="text-center text-gray-400 uppercase tracking-wide">Активная тревога</p>
        <p
          className={`text-center mt-2 font-bold text-l py-2 rounded-lg ${
            activeAlarm === "Нет активных тревог"
              ? "text-green-500 bg-green-100/20"
              : "text-red-500 bg-red-100/20"
          }`}
        >
          {activeAlarm}
        </p>
      </div>

    <div className="border-t border-gray-700 pt-3 mb-4">
  <p className="text-center text-gray-400 uppercase tracking-wide mb-2">Устройства</p>
  {Array.isArray(devicesList) && devicesList.length > 0 ? (
    devicesList.map((device, i) => (
      <div key={i} className="flex justify-between">
        <span>{i + 1}) {device.name}</span>
        <span className={device.is_online ? "text-green-500" : "text-red-500"}>
          {device.is_online ? "В сети" : "Не в сети"}
        </span>
      </div>
    ))
  ) : (
    <p className="text-center text-red-500">Не удалось получить список устройств</p>
  )}
</div>

    </div>
  );
}