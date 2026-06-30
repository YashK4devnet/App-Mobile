import React from 'react';

export default function ProgressBar({ 
  percent, 
  filled, 
  total, 
  label = "Progress" 
}) {
  return (
    <div className="px-5 pt-5 pb-3 border-b border-slate-100 bg-white z-10 select-none">
      <h4 className="text-[13px] font-bold text-slate-800 mb-2">{label}</h4>
      <div className="w-full h-2.5 bg-[#FFF4E8] rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-[#F98A15] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px]">
        {filled !== undefined && total !== undefined ? (
          <span className="text-slate-500 font-semibold">
            {filled} of {total} completed
          </span>
        ) : (
          <span className="text-slate-500 font-semibold">Progress</span>
        )}
        <span className="text-[#F98A15] font-black">{percent}%</span>
      </div>
    </div>
  );
}
