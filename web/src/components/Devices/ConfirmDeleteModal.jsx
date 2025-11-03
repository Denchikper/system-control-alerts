import React, { useEffect, useState } from "react";

export default function CreateDeviceModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const deviceTypes = [
    { label: "Реле", value: "relay" },
    { label: "Приемник", value: "receiver" },
  ];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDeviceName(initialData.device_name || "");
      setDeviceType(initialData.device_type || "");
      setIpAddress(initialData.ip_address || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDeviceName("");
      setDeviceType("");
      setIpAddress("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !deviceType.trim() || !ipAddress.trim()) return;

    onCreate({
      name,
      device_name: deviceName,
      device_type: deviceType,
      ip_address: ipAddress,
      description,
    });

    if (!initialData) {
      setName("");
      setDeviceName("");
      setDeviceType("");
      setIpAddress("");
      setDescription("");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151A22] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">
          {initialData ? "Редактировать устройство" : "Добавить устройство"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Название */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 
                         text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Например: Relay Controller"
            />
          </div>

          {/* Имя устройства */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Имя устройства</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 
                         text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Relay_device"
            />
          </div>

          {/* Тип устройства */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Тип устройства</label>
            <button
              type="button"
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              className="w-full flex justify-between items-center bg-[#0E1117] border border-gray-600 
                         rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
            >
              <span className={deviceType ? "text-gray-100" : "text-gray-400"}>
                {deviceTypes.find((t) => t.value === deviceType)?.label || "Выберите тип устройства"}
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isOpenDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown с анимацией */}
            <ul
              className={`absolute z-10 mt-1 w-full bg-[#0E1117] border border-gray-700 rounded-lg shadow-lg 
                         transform origin-top transition-all duration-200 ease-out ${
                           isOpenDropdown
                             ? "opacity-100 scale-y-100 translate-y-0"
                             : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                         }`}
            >
              {deviceTypes.map((type) => (
                <li
                  key={type.value}
                  onClick={() => {
                    setDeviceType(type.value);
                    setIsOpenDropdown(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-600/40 rounded-lg transition-colors ${
                    deviceType === type.value ? "bg-blue-600/60" : ""
                  }`}
                >
                  {type.label}
                </li>
              ))}
            </ul>
          </div>

          {/* IP адрес */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">IP адрес</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 
                         text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="192.168.1.10"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0E1117] border border-gray-600 rounded-lg px-3 py-2 
                         text-gray-100 placeholder-gray-400 h-20 resize-none focus:outline-none focus:border-blue-500"
              placeholder="Дополнительная информация..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
            >
              {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
