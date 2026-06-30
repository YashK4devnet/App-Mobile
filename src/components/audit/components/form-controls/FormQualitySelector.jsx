import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormQualitySelector({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  required = false 
}) {
  return (
    <div className="space-y-1.5">
      <Label text={label} required={required} />
      <div className="flex gap-2">
        {['Good', 'Average', 'Poor'].map((quality) => {
          const isActive = value === quality;
          let activeClass = '';
          if (isActive) {
            if (quality === 'Good') activeClass = 'bg-emerald-500 border-emerald-500 text-white shadow-sm';
            else if (quality === 'Average') activeClass = 'bg-[#F98A15] border-[#F98A15] text-white shadow-sm shadow-orange-500/20';
            else activeClass = 'bg-rose-500 border-rose-500 text-white shadow-sm';
          } else {
            activeClass = 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
          }
          return (
            <button
              key={quality}
              type="button"
              onClick={() => onChange(name, quality)}
              className={`flex-1 py-2.5 px-2 text-[12px] font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
            >
              {quality}
            </button>
          );
        })}
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
