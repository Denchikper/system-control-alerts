import { Trash2 } from "lucide-react";
import { utcToLocalTime } from "../../../../utils/formatTime";

export default function EditableEventRow({ event, handleDeleteLesson }) {

  return (
    <div className="bg-[#1F242D] rounded-lg p-3 flex gap-3 custom-scrollbar">
      
      {/* номер */}
      <div className="font-semibold text-blue-400 min-w-6 text-center">
        {event.event_order}
      </div>

      {/* контент */}
      <div className="flex flex-col gap-2 w-full">
        <span className="font-medium text-sm">Урок</span>

        {/* ВРЕМЯ — ТОЛЬКО В КОЛОНКУ */}
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs text-gray-400">
            С:
            <input
              type="time"
              defaultValue={utcToLocalTime(event.start_time)}
              className="mt-1 ml-5 bg-[#0D1117] border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </label>

          <label className="text-xs text-gray-400 ">
            До:
            <input
              type="time"
              defaultValue={utcToLocalTime(event.end_time)}
              className="mt-1 ml-3 bg-[#0D1117] border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </label>
        </div>

        {/* действия */}
        <button onClick={() => handleDeleteLesson(event.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-1 cursor-pointer">
          <Trash2 size={14} />
          Удалить урок
        </button>
      </div>
    </div>
  );
}
