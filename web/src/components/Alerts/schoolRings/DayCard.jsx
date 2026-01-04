import React from "react";

export default function DayCard({ name, events = [] }) {
  return (
    <div className="flex flex-col items-center bg-[#161B22] p-5 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md transition-all">
      
      {/* Название дня */}
      <div className="bg-[#151A22] text-gray-300 w-full flex items-center justify-center rounded-2xl mb-2 border border-gray-700 p-2 text-center wrap-break-words">
        {name}
      </div>

      {/* Дополнительный контент */}
      <div className="w-full flex flex-col gap-2">
        {events.length === 0 ? (
          <div className="text-gray-500 text-sm text-center mt-4">Нет событий</div>
        ) : (
          events
            .sort((a, b) => a.event_order - b.event_order) // сортируем по порядку
            .map(event => (
        <div
            key={event.id}
            className="bg-[#1F242D] text-gray-200 p-3 rounded-lg flex justify-between items-center gap-2 shadow-sm hover:bg-[#2A303C] transition-colors"
        >
        {/* Номер урока */}
            <div className="font-semibold text-blue-400 min-w-6 text-center">
            {event.event_order}
            </div>

        {/* Название и время урока */}
        <div className="flex flex-col flex-1">
            <span className="font-medium">Урок</span>
            <span className="text-gray-400 text-sm">{event.start_time_local} - {event.end_time_local}</span>
        </div>

        </div>))
        )}
      </div>
    </div>
  );
}
