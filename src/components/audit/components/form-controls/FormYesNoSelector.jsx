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
  noColor = 'rose'
}) {
  const activeNoClass = 'bg-rose-500 border-rose-500 text-white shadow-xs';

  return (
    <div className="space-y-1.5">
      <Label text={label} required={required} />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(name, 'yes')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-semibold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'yes'
              ? 'bg-[#ff7700] border-[#ff7700] text-white shadow-xs'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(name, 'no')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-semibold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'no'
              ? activeNoClass
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
        >
          No
        </button>
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
