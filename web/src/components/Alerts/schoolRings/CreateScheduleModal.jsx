import { useState } from "react";
import { X } from "lucide-react";

export default function CreateScheduleModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalEnter">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-[90vw] max-w-md bg-[#0D1117] rounded-2xl p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-semibold text-white">
            Создание расписания
          </h2>
        </div>

        {/* Input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название расписания"
          className="w-full px-4 py-2 rounded-lg bg-[#161B22] border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
        />

        {/* Footer */}
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D]"
          >
            Отменить
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
