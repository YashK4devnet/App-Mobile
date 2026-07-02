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
          <span className="text-[12px] font-medium text-[#ff6b6b] bg-white/10 px-2 rounded">
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
            className={`py-2 text-[14px] font-medium rounded-lg border transition-all active:scale-[0.95] cursor-pointer ${
              parseInt(value) === num
                ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm'
                : 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Poor</span>
        <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Excellent</span>
      </div>

      {error && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
