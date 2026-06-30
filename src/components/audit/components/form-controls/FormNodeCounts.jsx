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
    <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl select-none">
      <Label text={label} required={required} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Available</span>
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
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400 ${
              errorAvail ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#F98A15]'
            }`}
          />
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Working</span>
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
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400 ${
              errorWork ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#F98A15]'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
