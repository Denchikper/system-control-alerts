import React from "react";

export default function AlarmItem({ alarm, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:bg-[var(--surface)] transition">
      <div>
        <p className="text-lg font-medium">{alarm.name}</p>
        <p className="text-sm text-[var(--text-muted)]">{alarm.description}</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onEdit(alarm.id)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium cursor-pointer"
        >
          Редактировать
        </button>
        <button
          onClick={() => onDelete(alarm.id)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium cursor-pointer"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}