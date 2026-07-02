import React from 'react';

export default function ProgressBar({ 
  percent, 
  filled, 
  total, 
  label = "Progress" 
}) {
  return (
    <div className="px-5 pt-5 pb-3 border-b border-white/10 bg-[#0F0F23]/80 backdrop-blur-xl z-10 select-none">
      <h4 className="text-[13px] font-light tracking-wide text-white mb-2">{label}</h4>
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px]">
        {filled !== undefined && total !== undefined ? (
          <span className="text-white/50 font-light tracking-wider uppercase">
            {filled} of {total} completed
          </span>
        ) : (
          <span className="text-white/50 font-light tracking-wider uppercase">Progress</span>
        )}
        <span className="text-[#4ecdc4] font-light tracking-wider">{percent}%</span>
      </div>
    </div>
  );
}
