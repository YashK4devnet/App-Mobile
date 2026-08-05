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
            if (opt === 'yes') activeClass = 'bg-[#ff7700] border-[#ff7700] text-white shadow-xs';
            else if (opt === 'no') activeClass = 'bg-rose-500 border-rose-500 text-white shadow-xs';
            else activeClass = 'bg-slate-700 border-slate-700 text-white shadow-xs';
          } else {
            activeClass = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs';
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(name, opt)}
              className={`flex-1 py-2.5 px-2 text-[13px] font-semibold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
            >
              {opt.toUpperCase()}
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
