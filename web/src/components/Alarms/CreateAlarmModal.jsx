import React, { useState, useEffect } from "react";
import StyledCheckbox from "../ui/StyledCheckbox";

export default function CreateAlarmModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState(1);
  const [isDrill, setIsDrill] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const channelOptions = Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Канал ${i + 1}`,
  }));

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setChannel(initialData.channel || 1);
        setIsDrill(initialData.is_drill || false);
      } else {
        setName("");
        setDescription("");
        setChannel(1);
        setIsDrill(false);
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, description, channel, is_drill: isDrill });
    onClose();
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectOption = (value) => {
    setChannel(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[#151A22] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl transform transition-all duration-300 animate-modalEnter">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">
          {initialData ? "Редактировать тревогу" : "Создать новую тревогу"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Название тревоги</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 text-gray-100 
                         placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              placeholder="Например: Пожарная тревога"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 text-gray-100 h-24 resize-none
                         placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              placeholder="Краткое описание тревоги..."
            />
          </div>

          {/* Канал */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Канал</label>
            <div
              onClick={toggleDropdown}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 text-gray-100 cursor-pointer flex justify-between items-center 
                         focus:outline-none focus:border-blue-500 transition-all duration-200"
            >
              <span>{channelOptions.find((opt) => opt.value === channel)?.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[#0E1117] border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto animate-fadeIn z-50">
                {channelOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => selectOption(opt.value)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors ${
                      opt.value === channel ? "bg-gray-700" : ""
                    }`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Учебная тревога */}
          <div className="mt-5">
            <StyledCheckbox
              label="Учебная тревога"
              checked={isDrill}
              onChange={(checked) => setIsDrill(checked)}
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-sm"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
            >
              {initialData ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
