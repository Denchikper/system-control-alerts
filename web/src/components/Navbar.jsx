import React from "react"; 
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-[#0E1117] border-b border-gray-700 select-none">
      {/* Логотип слева */}
      <div className="flex items-center select-none pointer-events-none shrink-0" draggable={false}>
        <img 
          src="/icon.png" 
          alt="logo" 
          className="w-10 h-10 mr-3 pointer-events-none select-none" 
          draggable={false} 
        />
      </div>
      {/* Кнопки по центру */}
      <div className="flex-1 flex justify-center">
        <div className="flex space-x-6 text-gray-300">
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Главная
          </button>
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/alarms")}
          >
            Тревоги
          </button>
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/plannedalerts")}
          >
            Запланированные оповещения
          </button>
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/devices")}
          >
            Устройства
          </button>
          <button 
            className="hover:text-white font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/settings")}
          >
            Настройки
          </button>
        </div>
      </div>

      {/* Профиль справа */}
      <div className="shrink-0 select-none">
        <ProfileMenu />
      </div>
    </div>
  );
}