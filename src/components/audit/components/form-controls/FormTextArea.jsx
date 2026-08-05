import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormTextArea({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  placeholder = "Enter remarks (if any)", 
  required = false, 
  rows = 3 
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} text={label} required={required} />
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border rounded-xl px-4 py-3 text-[14px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 outline-none text-[#0f172a] placeholder-slate-400 shadow-xs ${
          error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-[#ff7700]'
        }`}
      />
      {error && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
