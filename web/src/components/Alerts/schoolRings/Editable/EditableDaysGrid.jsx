import EditableDayColumn from "./EditableDayColumn";

export default function EditableDaysGrid({ daysList, scenarioList, setLessonModalOpen, setDayChoicen, setEventsChoicen, handleDeleteLesson }) {
  const eventsByDay = {};

  scenarioList.forEach(s => {
    eventsByDay[s.day_id] = s.ScheduleEvents || [];
  });

  const sortedDays = [...daysList].sort((a, b) => {
    const ai = a.order_index === 0 ? 7 : a.order_index;
    const bi = b.order_index === 0 ? 7 : b.order_index;
    return ai - bi;
  });

  return (
    <div className="grid grid-flow-col auto-cols-[220px] gap-5 custom-scrollbar-2">
      {sortedDays.map(day => (
        <EditableDayColumn
          key={day.id}
          day={day}
          handleDeleteLesson={handleDeleteLesson}
          setEventsChoicen={setEventsChoicen}
          setLessonModalOpen={setLessonModalOpen}
          setDayChoicen={setDayChoicen}
          events={eventsByDay[day.id] || []}
        />
      ))}
    </div>
  );
}
