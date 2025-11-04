import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function SchoolBellsPage() {
  useEffect(() => {
      document.title = "Школьные Звонки | СУЗО";
  }, []);

return (
  <div className="flex flex-col h-screen bg-[#0E1117] text-gray-200">
    <Navbar />
    <div className="max-w-5xl mx-auto mt-20 px-6">
      <p className="text-center text-2xl py-8">Эта функция еще не реализована. Нужно ждать следующего релиза сервера...</p>
    </div>
  </div>
  );
}
