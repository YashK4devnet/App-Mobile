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
        className={`w-full bg-white border rounded-xl px-4 py-3 text-[14px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400 ${
          error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#F98A15]'
        }`}
      />
      {error && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
