import React, { useEffect, useState } from "react";
import ConfirmActivateModal from "./ConfirmActivateModal";
import ErrorModal from "./ErrorModal"; 
import { activateAlarm, deactivateAlarm } from "../api/alarms/alarms";
import { getAlarms } from "../api/alarms/alarms";

export default function AlarmControlPanel({ token, logout, navigate }) {

  useEffect (() => {
    const loadAlarms = async () => {
        try {
            const data = await getAlarms(token, logout);
            if(data.ok) {
                setAlarms(data.data || []);
            }
        } catch (err) {
            console.error("Ошибка при загрузке тревог:", err);
        }
    }

    loadAlarms();
    const interval = setInterval(loadAlarms, 5000);
    return () => clearInterval(interval);
  }, [token, logout, navigate]);



  const [alarms, setAlarms] = useState([]);  
  const [confirmModal, setConfirmModal] = useState({ open: false, alarm: null });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const alarmList = Array.isArray(alarms) ? alarms : [];
  console.log(alarmList)
  const openConfirm = (alarm) => setConfirmModal({ open: true, alarm });
  const closeConfirm = () => setConfirmModal({ open: false, alarm: null });

  const handleConfirmActivate = async () => {
    if (!confirmModal.alarm) return;

    try {
      const res = await activateAlarm(token, confirmModal.alarm.id, logout, navigate);

      if (!res.ok) {
        setErrorModal({ open: true, message: res.data.errorMessage });
      }

      closeConfirm();
    } catch (err) {
      console.error("Ошибка при активации будильника:", err);
      let message = "Произошла неизвестная ошибка";

      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {}

      setErrorModal({ open: true, message });
      closeConfirm();
    }
  };

  const handleDeactivateAllClick = async () => {
    try {
      const res = await deactivateAlarm(token, logout, navigate);

      if (!res.ok) {
        setErrorModal({ open: true, message: res.data.errorMessage });
      }

      closeConfirm();
    } catch (err) {
      console.error("Ошибка при деактивации всех тревог:", err);
      let message = "Произошла неизвестная ошибка";

      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {}

      setErrorModal({ open: true, message });
      closeConfirm();
    }
  };

  return (
    <>
      <div
        className="w-[41%] bg-[#151A22] border border-gray-700 rounded-2xl p-6 shadow-lg
                   transition-all duration-300 flex flex-col"
        style={{ height: alarms.length <= 8 ? `${160 + Math.ceil(alarms.length / 2) * 70}px` : "480px" }}
      >
        <h3 className="text-lg font-semibold mb-5 text-gray-100 text-center">
          Управление тревогами
        </h3>

        {(!alarms || alarms.length === 0) ? (
          <p className="text-gray-400 text-center -mt-2.5">Сервер недоступен или тревоги не найдены</p>
        ) : (
<div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
  {alarmList.length === 0 ? (
    <p className="text-gray-400 text-center mt-20">Сервер недоступен или тревоги не найдены</p>
  ) : (
    alarmList.map((alarm) => (
      <button
        key={alarm.id}
        onClick={() => openConfirm(alarm)}
        className="px-3 py-3 rounded-lg border text-left font-medium 
                   transition-all duration-300 shadow-md relative text-sm
                   bg-[#1A1F29] border-gray-700 hover:bg-[#222832] text-gray-100 hover:scale-[1.004]"
      >
        {alarm.name}
      </button>
    ))
  )}
</div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDeactivateAllClick}
            className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-500 
                       hover:from-blue-700 hover:to-blue-600 rounded-lg text-white 
                       font-semibold text-sm transition-all duration-300 
                       hover:scale-105 shadow-[0_0_10px_rgba(50,100,255,0.4)]"
          >
            Отключить все тревоги
          </button>
        </div>
      </div>

      <ConfirmActivateModal
        isOpen={confirmModal.open}
        onClose={closeConfirm}
        onConfirm={handleConfirmActivate}
        alarmName={confirmModal.alarm?.name}
      />

      <ErrorModal
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: "" })}
        message={errorModal.message}
      />
    </>
  );
}