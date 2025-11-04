import React from "react";

export default function DeviceItem({ device, onEdit, onDelete }) {
  return (
    <div className="bg-[#151A22] border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:border-blue-500 transition">
      <div>
        <h3 className="text-lg font-medium text-gray-100">{device.name}</h3>
        <p className="text-sm text-gray-400">
          Тип: {device.device_type} | IP: {device.ip_address}
        </p>
        {device.description && (
          <p className="text-sm text-gray-500 mt-1 italic">{device.description}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium cursor-pointer"
        >
          Редактировать
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium cursor-pointer"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
