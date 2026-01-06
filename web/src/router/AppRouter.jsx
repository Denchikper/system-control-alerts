import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AlarmsPage from "../pages/Alarms.jsx";
import PlannedAlertsPage from "../pages/PlannedAlerts.jsx";
import DevicesPage from "../pages/Devices.jsx";
import SettingsPage from "../pages/Settings.jsx";

export default function AppRouter() {
  const { token, loading } = useAuth();

  if (loading) return <div>Загрузка...</div>; // пока проверяем токен

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/alarms"
        element={
          <PrivateRoute>
            <AlarmsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/plannedalerts"
        element={
          <PrivateRoute>
            <PlannedAlertsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <PrivateRoute>
            <DevicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
