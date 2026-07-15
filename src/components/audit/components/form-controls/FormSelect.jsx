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
          className={`w-full bg-white/5 backdrop-blur-md border ${error ? 'border-[#ff6b6b]' : 'border-white/20'} rounded-xl px-4 py-3 text-[14px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white appearance-none cursor-pointer`}
        >
          <option value="" disabled className="text-gray-500 bg-[#1a1f2e]">Select an option</option>
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={idx} value={val} className="bg-[#1a1f2e] text-white">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-[11px] text-[#ff6b6b] mt-1 ml-1 block">{error}</span>}
    </div>
  );
}
