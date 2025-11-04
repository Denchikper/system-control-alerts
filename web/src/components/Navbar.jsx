import React, { useState, useEffect } from "react"; 
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

return (
    <div className="relative flex items-center px-6 py-3 bg-[#0E1117] border-b border-gray-700">
      {/* Лого + название слева */}
      <div className="flex items-center z-10 select-none pointer-events-none" draggable={false}>
        <img src="/icon.png" alt="logo" className="w-10 h-10 mr-3 pointer-events-none select-none" draggable={false} />
        <span className="text-gray-100 font-semibold pointer-events-none select-none">
          Система управления звуковыми оповещениями
        </span>
      </div>

      {/* Вкладки по центру, адаптивные */}
      <div className="absolute left-1/2 transform -translate-x-1/2 overflow-x-auto z-0">
        <div className="flex space-x-6 min-w-max text-gray-300">
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/dashboard")}
            >
            Главная
          </button>
          <button className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/alarms")}
          >
            Тревоги
          </button>
          <button className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/schoolbells")}
          >
            Школьные Звонки
          </button>
          <button className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/plannedalerts")}
          >
            Запланированные оповещения
          </button>
          <button className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/devices")}
          >
            Устройства
          </button>
          <button className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/settings")}
          >
            Настройки
          </button>
        </div>
      </div>

      {/* Профиль справа */}
      <div className="ml-auto z-10 select-none">
        <ProfileMenu />
      </div>
    </div>
  );
}