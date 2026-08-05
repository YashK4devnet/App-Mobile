import React from 'react';
import { Label } from './Label';

export function FormSelect({ 
  label, 
  name, 
  value = '', 
  error, 
  onChange, 
  options = [],
  required = false
}) {
  return (
    <div className="space-y-1.5 w-full select-none">
      <Label text={label} required={required} />
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full bg-white border ${error ? 'border-rose-500' : 'border-slate-300'} rounded-xl px-4 py-3 text-[14px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] appearance-none cursor-pointer shadow-xs`}
        >
          <option value="" disabled className="text-slate-400 bg-white">Select an option</option>
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={idx} value={val} className="bg-white text-[#0f172a]">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-[11px] text-rose-500 mt-1 ml-1 block">{error}</span>}
    </div>
  );
}
