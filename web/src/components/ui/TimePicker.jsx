import { useState, useRef, useEffect } from "react";

export default function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [h, m] = value.split(":");

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* input button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 bg-[#161B22] border border-gray-700 rounded-lg text-sm text-gray-200 hover:border-blue-500 transition-colors"
      >
        <span>{h}</span>
        <span className="text-gray-400">:</span>
        <span>{m}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 flex w-full bg-[#0D1117] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          
          {/* часы */}
          <div className="max-h-40 overflow-y-auto w-1/2 border-r border-gray-700">
            {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hour) => (
              <button
                key={hour}
                onClick={() => onChange(`${hour}:${m}`)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-blue-600 transition-colors ${
                  hour === h ? "bg-blue-700 text-white font-bold" : "text-gray-200"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>

          {/* минуты */}
          <div className="max-h-40 overflow-y-auto w-1/2">
            {["00","05","10","15","20","25","30","35","40","45","50","55"].map((min) => (
              <button
                key={min}
                onClick={() => onChange(`${h}:${min}`)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-blue-600 transition-colors ${
                  min === m ? "bg-blue-700 text-white font-bold" : "text-gray-200"
                }`}
              >
                {min}
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
