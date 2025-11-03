// src/pages/DevicesPage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DeviceItem from "../components/Devices/DeviceItem";
import CreateDeviceModal from "../components/Devices/CreateDeviceModal";
import ConfirmDeleteModal from "../components/Devices/ConfirmDeleteModal";

import { getDevices, createDevice, updateDevice, deleteDevice } from "../api/devices/devices";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DevicesPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // модал создания/редактирования
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // подтверждение удаления
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDevices() {
    setLoading(true);
    setError(null);
    try {
      const data = await getDevices(token, logout, navigate);
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки устройств:", err);
      setError("Не удалось загрузить список устройств");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }

  // открыть создание
  function openCreate() {
    setEditingDevice(null);
    setIsCreateOpen(true);
  }

  // открыть редактирование
  function openEdit(device) {
    setEditingDevice(device);
    setIsCreateOpen(true);
  }

  // закрыть модал
  function closeCreate() {
    setEditingDevice(null);
    setIsCreateOpen(false);
  }

  // создать/обновить устройство
  async function handleCreateOrUpdate(payload) {
    try {
      if (editingDevice && editingDevice.id) {
        await updateDevice(token, editingDevice.id, payload, logout, navigate);
      } else {
        await createDevice(token, payload, logout, navigate);
      }
      await loadDevices();
    } catch (err) {
      console.error("Ошибка create/update устройства:", err);
    } finally {
      closeCreate();
    }
  }

  // открыть подтверждение удаления
  function handleDeleteClick(id, name) {
    setDeleteModal({ isOpen: true, id, name });
  }

  // подтвердить удаление
  async function handleConfirmDelete() {
    const { id } = deleteModal;
    try {
      await deleteDevice(token, id, logout, navigate);
      await loadDevices();
    } catch (err) {
      console.error("Ошибка удаления устройства:", err);
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: "" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-gray-100">
        <Navbar />
        <div className="max-w-5xl mx-auto mt-8 px-6">
          <p className="text-center py-8">Загрузка устройств...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Список устройств</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            >
              + Добавить устройство
            </button>
            <button
              onClick={loadDevices}
              title="Обновить"
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Обновить
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="space-y-4">
          {devices.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Нет зарегистрированных устройств</p>
          ) : (
            devices.map((device) => (
              <DeviceItem
                key={device.id}
                device={device}
                onEdit={() => openEdit(device)}
                onDelete={() => handleDeleteClick(device.id, device.name)}
              />
            ))
          )}
        </div>
      </div>

      {/* Модал создания/редактирования */}
      <CreateDeviceModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onCreate={handleCreateOrUpdate}
        initialData={editingDevice ?? undefined}
      />

      {/* Подтверждение удаления */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        deviceName={deleteModal.name}
      />
    </div>
  );
}
