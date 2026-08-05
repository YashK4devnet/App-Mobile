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
        {['good', 'moderate', 'poor'].map((quality) => {
          const isActive = value === quality;
          let activeClass = '';
          if (isActive) {
            if (quality === 'good') activeClass = 'bg-[#ff7700] border-[#ff7700] text-white shadow-xs';
            else if (quality === 'moderate') activeClass = 'bg-amber-500 border-amber-500 text-white shadow-xs';
            else activeClass = 'bg-rose-500 border-rose-500 text-white shadow-xs';
          } else {
            activeClass = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs';
          }
          return (
            <button
              key={quality}
              type="button"
              onClick={() => onChange(name, quality)}
              className={`flex-1 py-2.5 px-2 text-[12px] font-semibold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
            >
              {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </button>
          );
        })}
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
