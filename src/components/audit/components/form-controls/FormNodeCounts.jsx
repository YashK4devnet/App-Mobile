import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormNodeCounts({ 
  label, 
  prefix, 
  formData, 
  errors, 
  onChange, 
  required = false 
}) {
  const availField = `${prefix}Available`;
  const workField = `${prefix}Working`;
  const availVal = formData[availField] || '';
  const workVal = formData[workField] || '';
  const errorAvail = errors[availField];
  const errorWork = errors[workField];

  return (
    <div className="space-y-2 p-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl select-none">
      <Label text={label} required={required} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Available</span>
          <input
            type="text"
            name={availField}
            value={availVal}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              onChange(availField, digits);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 50"
            className={`w-full bg-white/5 backdrop-blur-md border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] outline-none text-white placeholder-white/40 ${
              errorAvail ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : 'border-white/20 focus:border-[#4ecdc4]'
            }`}
          />
        </div>
        <div>
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Working</span>
          <input
            type="text"
            name={workField}
            value={workVal}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              onChange(workField, digits);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 48"
            className={`w-full bg-white/5 backdrop-blur-md border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] outline-none text-white placeholder-white/40 ${
              errorWork ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : 'border-white/20 focus:border-[#4ecdc4]'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
