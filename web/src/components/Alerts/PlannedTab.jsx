import React from "react";

export default function PlannedTab({plannedAlerts}) {

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Запланированные оповещения</h2>
        {plannedAlerts.length === 0 ? (
        <p className="text-gray-400 text-center">Нет запланированных оповещений</p>
        ) : (
        <ul className="space-y-2">
            {plannedAlerts.map(alert => (
            <li key={alert.id} className="p-2 bg-[#0E1117] rounded-lg border border-gray-700">
                <strong>{alert.name}</strong> — {alert.description || "Нет описания"} <br/>
                Тип: {alert.event_type}, Время: {alert.start_time} — {alert.end_time}
            </li>
            ))}
        </ul>
        )}
    </div>
  );
}
