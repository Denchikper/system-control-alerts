import React, { useEffect } from "react";
import Navbar from "../components/NavBar.jsx";

export default function SettingsPage() {
  useEffect(() => {
      document.title = "Настройки  | СУЗО";
  }, []);

return (
  <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200">
    <Navbar />
  </div>
  );
}
