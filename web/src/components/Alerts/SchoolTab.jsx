import React, { useEffect, useState } from "react";
import DaysList from "./schoolRings/DaysList";
import StyledSelect from "../ui/StyledSelect";
import { daysListGet } from "../../api/alerts/days";
import { activateSchedule, deleteSchedules, schedulesActiveListGet, schedulesCreate, schedulesListGet } from "../../api/alerts/schedules";
import { scenariosGet } from "../../api/alerts/scenarios";
import EditScheduleMenu from "./schoolRings/Editable/EditScheduleMenu";
import ConfirmDeleteScheduleModal from "./schoolRings/Editable/ConfirmDeleteScheduleModal";
import CreateScheduleModal from "./schoolRings/CreateScheduleModal";

export default function SchoolTab({ token,  logout, navigate}) {
  const [isCreateScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [activeSchedule, setActiveSchedule] = useState([]);
  const [scenarioList, setScenarioList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, name: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    const scheduleToDelete = schedules.find(s => s.id === selectedSchedule);
    if (scheduleToDelete) {
      setDeleteModal({ 
        isOpen: true, 
        name: scheduleToDelete.name 
      });
    }
  }

  const handleCreateSchedule = async (name) => {
    const res = await schedulesCreate(token, name, logout, navigate);
    if (res.ok) {
      const resSchedules = await schedulesListGet(token, logout, navigate);
      if (resSchedules.ok) {
        const newSchedule =  resSchedules.data.find(s => s.name === name) || {}
        setSchedules(resSchedules.data);
        setSelectedSchedule(newSchedule.id);
      }
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteSchedules(token, selectedSchedule, logout, navigate);
      if (res.ok) {
        const resSchedules = await schedulesListGet(token, logout, navigate);
        if (resSchedules.ok) {
          setSchedules(resSchedules.data);
          setSelectedSchedule("");
          setScenarioList([]);
            
          if (activeSchedule.id === selectedSchedule) {
            setActiveSchedule({})
            await updateActiveSchedule();
          } else {
            setSelectedSchedule(activeSchedule.id);
        }
       }
      }
        setIsEditOpen(false);
      } catch (err) {
      console.error("Ошибка удаления расписания:", err);
    } finally {
      setDeleteModal({ isOpen: false, name: "" });
    }
  };

  const handleSchedule = async () => {
    if (!selectedSchedule) return;
    await activateSchedule(token, selectedSchedule, logout, navigate);
    updateActiveSchedule();
  };

  const updateActiveSchedule = async () => {
    const resAсtiveSchedules = await schedulesActiveListGet(token, logout, navigate);
    if (resAсtiveSchedules.ok && resAсtiveSchedules.data.length > 0) {
      setActiveSchedule(resAсtiveSchedules.data[0])
      setSelectedSchedule(resAсtiveSchedules.data[0].id);
    }
  }

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
        if (!token) return;

        updateActiveSchedule();

        const resDays = await daysListGet(token, logout, navigate);
        const resSchedules = await schedulesListGet(token, logout, navigate);
    
        if (resDays.ok) setDaysList(resDays.data);
        if (resSchedules.ok) setSchedules(resSchedules.data);

        setLoading(false);
        }
        
        loadData();
  }, []);

  useEffect(() => {
    if (!selectedSchedule) {
      setScenarioList([]);
      return;
    }
    async function loadScenarios() {
        const resScenarioList = await scenariosGet(token, selectedSchedule, logout, navigate);
        if (resScenarioList.ok) setScenarioList(resScenarioList.data);
    }

    loadScenarios();
  }, [selectedSchedule]);

  const getSelectedSchedule = () => {
    return schedules.find(s => s.id === selectedSchedule) || {};
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-60">
            <StyledSelect
              style="appearance-none max-w-60 bg-[#151921] text-gray-200 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              options={schedules.map((s) => ({ value: s.id, label: s.name }))}
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(Number(e.target.value))}
              placeholder="Выберите расписание"
            />
          </div>
          <button
            onClick={handleSchedule}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-sm font-medium cursor-pointer"
          >
            Активировать
          </button>
        </div>

        <div className="flex items-center gap-4 ">
          <span className="inline-flex items-center justify-center w-[280px] px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-full shadow-sm">
            <svg
              className="w-3 h-3 mr-2 shrink-0 text-green-400"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="4" />
            </svg>
              <span className="truncate whitespace-nowrap ">
                Активное расписание: {activeSchedule.name || "не выбрано"}
              </span>
          </span>

          <button onClick={() => setIsEditOpen(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700  transition-colors duration-200 text-sm font-medium cursor-pointer">
            Управление расписанием
          </button>
          <button onClick={() => setCreateScheduleModalOpen(true)} className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700  transition-colors duration-200 text-sm font-medium cursor-pointer">
            Создать
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center animate-modalEnter">
        <DaysList daysList={daysList} scenarioList={scenarioList}/>
      </div>

      {isEditOpen && (
        <EditScheduleMenu 
        handleDeleteClick={handleDeleteClick}
        activeSchedule={activeSchedule}
        updateActiveSchedule={updateActiveSchedule} 
        setSchedules={setSchedules} 
        setScenarioList={setScenarioList} 
        token={token} 
        logout={logout} 
        navigate={navigate} 
        onClose={() => setIsEditOpen(false)} 
        daysList={daysList} 
        scenarioList={scenarioList} 
        schedulesActual={getSelectedSchedule()}
        />
      )}

      <ConfirmDeleteScheduleModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, name: "" })}
        onConfirm={handleConfirmDelete}
        scheduleName={getSelectedSchedule()}
      />
      {isCreateScheduleModalOpen && (
        <CreateScheduleModal onClose={() => setCreateScheduleModalOpen(false)} onCreate={(name) => handleCreateSchedule(name)}/>
      )}

    </div>
  );
}
