import React from "react";

export default function StyledCheckbox({ label, checked, onChange }) {
  const toggle = () => onChange(!checked);

  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={toggle}
    >
      <div
        className={`w-6 h-6 rounded-md border transition-all duration-200 flex items-center justify-center
        ${checked ? "bg-blue-600 border-blue-500" : "bg-[#0E1117] border-gray-600 hover:border-gray-400"}`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-gray-300">{label}</span>
    </label>
  );
}
