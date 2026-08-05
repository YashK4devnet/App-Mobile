import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormRating10Scale({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  required = false 
}) {
  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center mb-2">
        <Label text={label} required={required} />
        {value && (
          <span className="text-[12px] font-bold text-[#ea580c] bg-[#ff7700]/10 border border-[#ff7700]/25 px-2 py-0.5 rounded-full">
            {value}/10
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {ratings.map(num => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(name, num)}
            className={`py-2 text-[14px] font-bold rounded-lg border transition-all active:scale-[0.95] cursor-pointer ${
              parseInt(value) === num
                ? 'bg-[#ff7700] border-[#ff7700] text-white shadow-xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Poor</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Excellent</span>
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
