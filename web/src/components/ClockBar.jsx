import React, { useState, useEffect } from "react";
import { getServerTime } from "../api/server/getServerTime"; // только серверное
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ClockBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [localTime, setLocalTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [serverTime, setServerTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const formatTime = (num) => String(num).padStart(2, "0");

  // функция для локального времени
  const getLocalTime = () => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  };

  // обновляем локальное время каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(getLocalTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!token) return;

  useEffect(() => {
    const fetchServerTime = async () => {
      const time = await getServerTime(token, logout, navigate);
      setServerTime(time);
    };
    setLocalTime(getLocalTime());
    fetchServerTime(); // сразу при загрузке
    const interval = setInterval(fetchServerTime, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex space-x-6 text-gray-200 text-center">
      <div>Локальное время: {`${formatTime(localTime.hours)}:${formatTime(localTime.minutes)}:${formatTime(localTime.seconds)}`}</div>
      <div>Серверное время: {`${formatTime(serverTime.hours)}:${formatTime(serverTime.minutes)}:${formatTime(serverTime.seconds)}`}</div>
    </div>
  );
}
