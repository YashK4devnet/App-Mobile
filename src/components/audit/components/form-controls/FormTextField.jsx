import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormTextField({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  placeholder = "Enter value", 
  required = false, 
  type = 'text', 
  inputMode, 
  pattern,
  disabled = false,
  readOnly = false
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} text={label} required={required} />
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        className={`w-full border rounded-xl px-4 py-3 text-[14px] transition-all outline-none ${
          disabled || readOnly
            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none'
            : 'bg-white border-slate-200 focus:ring-1 focus:ring-[#F98A15] text-slate-800 focus:border-[#F98A15] placeholder-slate-400'
        } ${
          error ? 'border-red-400 focus:border-red-500' : ''
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
