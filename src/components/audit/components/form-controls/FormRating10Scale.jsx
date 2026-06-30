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
          <span className="text-[12px] font-black text-[#F98A15] bg-[#FFF4E8] px-2 rounded">
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
                ? 'bg-[#F98A15] border-[#F98A15] text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Poor</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Excellent</span>
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
