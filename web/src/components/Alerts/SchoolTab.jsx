import React, { use, useEffect, useState } from "react";
import DaysList from "./schoolRings/DaysList";
import StyledSelect from "../ui/StyledSelect";
import { daysListGet } from "../../api/alerts/days";
import { activateSchedule, schedulesActiveListGet, schedulesListGet } from "../../api/alerts/schedules";
import { scenariosGet } from "../../api/alerts/scenarios";

export default function SchoolTab({ token,  logout, navigate}) {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [activeSchedule, setActiveSchedule] = useState([]);
  const [scenarioList, setScenarioList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!selectedSchedule) return;
    const res = await activateSchedule(token, selectedSchedule, logout, navigate);
    const resAсtiveSchedules = await schedulesActiveListGet(token, logout, navigate);
    setActiveSchedule(resAсtiveSchedules.data[0])
  };

  useEffect(() => {
    setLoading(true);

    async function loadData() {
        if (!token) return;
        const resAсtiveSchedules = await schedulesActiveListGet(token, logout, navigate);
        const resDays = await daysListGet(token, logout, navigate);
        const resSchedules = await schedulesListGet(token, logout, navigate);
    
        if (resDays.ok) setDaysList(resDays.data);
        if (resAсtiveSchedules.ok && resAсtiveSchedules.data.length > 0) { 
            setSelectedSchedule(resAсtiveSchedules.data[0].id);
            setActiveSchedule(resAсtiveSchedules.data[0]);
        };
        if (resSchedules.ok) setSchedules(resSchedules.data);

        setLoading(false);
        }
        loadData();
  }, []);

  useEffect(() => {
    if (!selectedSchedule) return; // ждем, пока будет выбранное расписание

    async function loadScenarios() {
        const resScenarioList = await scenariosGet(token, selectedSchedule, logout, navigate);
        if (resScenarioList.ok) setScenarioList(resScenarioList.data);
    }

    loadScenarios();
  }, [selectedSchedule]); // вызывается каждый раз, когда selectedSchedule меняется

  return (
    <div className="flex flex-col gap-10">
      
      {/* Верхняя строка: селект слева */}
    <div className="flex items-center justify-between w-full">
  {/* Селект + Сохранить */}
  <div className="flex items-center gap-4">
    <div className="w-60">
      <StyledSelect
        style="appearance-none bg-[#151921] text-gray-200 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        options={schedules.map((s) => ({ value: s.id, label: s.name }))}
        value={selectedSchedule}
        onChange={(e) => setSelectedSchedule(e.target.value)}
        placeholder="Выберите расписание"
      />
    </div>
    <button
      onClick={handleSchedule}
      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-sm font-medium cursor-pointer"
    >
      Сохранить
    </button>
  </div>

  {/* Активное расписание + кнопки */}
  <div className="flex items-center gap-4">
    {/* Активное расписание */}
<span className="inline-flex items-center px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-full shadow-sm">
  <svg
    className="w-3 h-3 mr-2 text-green-400"
    fill="currentColor"
    viewBox="0 0 8 8"
  >
    <circle cx="4" cy="4" r="4" />
  </svg>
  Активное расписание: {activeSchedule.name || "не выбрано"}
</span>

    {/* Блок кнопок */}
      <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700  transition-colors duration-200 text-sm font-medium cursor-pointer">
        Управление расписаниями
      </button>
  </div>
</div>

      {/* Список дней — по центру */}
      <div className="w-full flex justify-center">
        <DaysList daysList={daysList} scenarioList={scenarioList}/>
      </div>
    </div>
  );
}
