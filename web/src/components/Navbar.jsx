import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Главная", path: "/dashboard", perm: "section:dashboard" },
  { label: "Тревоги", path: "/alarms", perm: "section:alarms" },
  { label: "Запланированные оповещения", path: "/plannedalerts", perm: "section:plannedalerts" },
  { label: "Устройства", path: "/devices", perm: "section:devices" },
  { label: "Настройки", path: "/settings", perm: "section:settings" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { can } = useAuth();
  const [open, setOpen] = useState(false);

  const items = NAV_ITEMS.filter((item) => can(item.perm));

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative bg-[var(--bg)] border-b border-[var(--border)] select-none">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2">
        {/* Логотип слева */}
        <div className="flex items-center select-none pointer-events-none shrink-0" draggable={false}>
          <img
            src="/icon.png"
            alt="logo"
            className="w-10 h-10 pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Кнопки по центру — только на md+ */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-4 lg:space-x-6 text-[var(--text-soft)]">
            {items.map((item) => (
              <button
                key={item.path}
                className="hover:text-[var(--text)] font-medium whitespace-nowrap hover:scale-101 transition-all duration-200 cursor-pointer text-sm lg:text-base"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Профиль + тема + бургер справа */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <button
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-soft)] hover:text-[var(--text)] cursor-pointer transition-colors"
            onClick={toggleTheme}
            aria-label="Переключить тему"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <ProfileMenu />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text)] cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Выпадающее меню на мобильном */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-2 flex flex-col animate-fadeIn">
          {items.map((item) => (
            <button
              key={item.path}
              className="text-left py-2 text-[var(--text-soft)] hover:text-[var(--text)] font-medium transition-colors cursor-pointer"
              onClick={() => go(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
