import { useState } from "react";
import { changeDutyPass } from "../api/users/changeDutyPass";

export default function ChangeDutyPanel({ token, logout, navigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await changeDutyPass(token, logout, navigate);

      if (res?.ok) {
        setResult(res.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Ошибка при изменении пароля duty_officer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PANEL */}
      <div className="w-[23%] min-w-[260px] h-[145px] bg-[#151A22] border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-100 text-center">
          Смена дежурного администратора
        </h2>

        <button
          onClick={handleClick}
          disabled={loading}
          className="
            w-full py-3
            bg-linear-to-r from-blue-600 to-blue-500 
          hover:from-blue-700 hover:to-blue-600
            rounded-xl text-white font-semibold text-sm
            transition-all duration-300
            hover:scale-[1.02]
            shadow-[0_0_18px_rgba(59,130,246,0.45)]
          "
        >
          {loading ? "Обновление..." : "Сменить администратора"}
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[380px] bg-[#151A22] border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-100 text-center mb-4">
              Готово
            </h3>

            <p className="text-sm text-gray-300 text-center mb-4">
              {result.message}
            </p>

            <div className="bg-black/40 border border-gray-600 rounded-xl p-4 text-center mb-6">
              <p className="text-xs text-gray-400 mb-1">
                Новый код доступа
              </p>
              <p className="text-2xl font-mono font-bold text-blue-400 tracking-widest">
                {result.code}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="
                w-full py-2 rounded-xl
                bg-gray-700 hover:bg-gray-600
                text-gray-100 font-semibold text-sm
                transition-all
              "
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
