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
    ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm shadow-[#ff6b6b]/20'
    : 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm shadow-[#ff6b6b]/10';

  return (
    <div className="space-y-1.5">
      <Label text={label} required={required} />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(name, 'yes')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-medium rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'yes'
              ? 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0F0F23] shadow-sm shadow-[#4ecdc4]/20'
              : 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(name, 'no')}
          className={`flex-1 py-2.5 px-4 text-[13px] font-medium rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
            value === 'no'
              ? activeNoClass
              : 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10'
          }`}
        >
          No
        </button>
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
