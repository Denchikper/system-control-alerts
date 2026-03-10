// src/pages/AlarmsPage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AlarmItem from "../components/Alarms/AlarmItem";
import CreateAlarmModal from "../components/Alarms/CreateAlarmModal";
import ConfirmDeleteModal from "../components/Alarms/ConfirmDeleteModal";

import { getAlarms, createAlarm, updateAlarm, deleteAlarm } from "../api/alarms/alarms";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AlarmsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // модал для создания/редактирования
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null); // null = создаём

  // подтверждение удаления
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    loadAlarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAlarms() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlarms(token, logout, navigate);
      // fetchWithAuth может вернуть null при 401, защитимся:
      if(data.ok) {
        setAlarms(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Ошибка загрузки тревог:", err);
      setError("Не удалось загрузить тревоги");
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  }

  // открываем модал для создания
  function openCreate() {
    setEditingAlarm(null);
    setIsCreateOpen(true);
  }

  // открываем модал для редактирования
  function openEdit(alarm) {
    setEditingAlarm(alarm);
    setIsCreateOpen(true);
  }

  // закрываем create modal
  function closeCreate() {
    setEditingAlarm(null);
    setIsCreateOpen(false);
  }

  // обработчик создания/сохранения (вызывается из CreateAlarmModal)
  async function handleCreateOrUpdate(payload) {
    // payload: { name, description, priority? }
    try {
      if (editingAlarm && editingAlarm.id) {
        await updateAlarm(token, editingAlarm.id, payload, logout, navigate);
      } else {
        await createAlarm(token, payload, logout, navigate);
      }
      await loadAlarms();
    } catch (err) {
      console.error("Ошибка create/update:", err);
      // можно показывать ошибку пользователю
    } finally {
      closeCreate();
    }
  }

  // открыть confirm delete
  function handleDeleteClick(id, name) {
    setDeleteModal({ isOpen: true, id, name });
  }

  // подтвердить удаление
  async function handleConfirmDelete() {
    const { id } = deleteModal;
    try {
      await deleteAlarm(token, id, logout, navigate);
      await loadAlarms();
    } catch (err) {
      console.error("Ошибка удаления:", err);
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: "" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-gray-100">
        <Navbar />
        <div className="max-w-5xl mx-auto mt-8 px-6">
          <p className="text-center py-8">Загрузка тревог...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Список тревог</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            >
              + Создать тревогу
            </button>
            <button
              onClick={loadAlarms}
              title="Обновить"
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Обновить
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="space-y-4 animate-modalEnter">
          {alarms.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Нет доступных тревог</p>
          ) : (
            alarms.map((alarm) => (
              <AlarmItem
                key={alarm.id}
                alarm={alarm}
                onEdit={() => openEdit(alarm)}
                onDelete={() => handleDeleteClick(alarm.id, alarm.name)}
              />
            ))
          )}
        </div>
      </div>

      {/* Модал создания/редактирования */}
      <CreateAlarmModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onCreate={handleCreateOrUpdate}
        // если твой CreateAlarmModal поддерживает initial values - передай их
        initialData={editingAlarm ?? undefined}
      />

      {/* Модал подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        alarmName={deleteModal.name}
      />
    </div>
  );
}
