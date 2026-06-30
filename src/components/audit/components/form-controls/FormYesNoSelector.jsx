import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormYesNoSelector({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  required = false,
  noColor = 'rose' // 'rose' | 'orange'
}) {
  const activeNoClass = noColor === 'orange'
    ? 'bg-[#F98A15] border-[#F98A15] text-white shadow-sm shadow-orange-500/20'
    : 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/10';

  return (
    <div className="space-y-1.5">
      <Label text={label} required={required} />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(name, 'yes')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'yes'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(name, 'no')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'no'
              ? activeNoClass
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          No
        </button>
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
