import React from 'react';

export default function ProgressBar({ 
  percent, 
  filled, 
  total, 
  label = "Progress" 
}) {
  return (
    <div className="px-5 pt-5 pb-3 border-b border-[#ff7700]/18 bg-white/95 backdrop-blur-xl z-10 select-none">
      <h4 className="text-[13px] font-semibold tracking-wide text-[#0f172a] mb-2">{label}</h4>
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-[#ff7700] to-[#ea580c] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px]">
        {filled !== undefined && total !== undefined ? (
          <span className="text-slate-500 font-medium tracking-wider uppercase">
            {filled} of {total} completed
          </span>
        ) : (
          <span className="text-slate-500 font-medium tracking-wider uppercase">Progress</span>
        )}
        <span className="text-[#ea580c] font-semibold tracking-wider">{percent}%</span>
      </div>
    </div>
  );
}
