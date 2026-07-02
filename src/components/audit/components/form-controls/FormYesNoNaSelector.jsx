import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormYesNoNaSelector({ 
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
        {['yes', 'no', 'NA'].map((opt) => {
          const isActive = value === opt;
          let activeClass = '';
          if (isActive) {
            if (opt === 'yes') activeClass = 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0F0F23] shadow-sm';
            else if (opt === 'no') activeClass = 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm';
            else activeClass = 'bg-white/20 border-white/20 text-white shadow-sm';
          } else {
            activeClass = 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10';
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(name, opt)}
              className={`flex-1 py-2.5 px-2 text-[13px] font-medium rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
            >
              {opt.toUpperCase()}
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
