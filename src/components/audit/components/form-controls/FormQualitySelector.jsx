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
            if (quality === 'Good') activeClass = 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0F0F23] shadow-sm';
            else if (quality === 'Average') activeClass = 'bg-yellow-500 border-yellow-500 text-white shadow-sm shadow-yellow-500/20';
            else activeClass = 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm';
          } else {
            activeClass = 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10';
          }
          return (
            <button
              key={quality}
              type="button"
              onClick={() => onChange(name, quality)}
              className={`flex-1 py-2.5 px-2 text-[12px] font-medium rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
            >
              {quality}
            </button>
          );
        })}
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
