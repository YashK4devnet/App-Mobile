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
  const isReadOnly = disabled || readOnly;

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
        disabled={isReadOnly}
        readOnly={readOnly}
        className={`w-full border rounded-xl px-4 py-3 text-[14px] transition-all outline-none ${
          isReadOnly
            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none'
            : 'bg-white border-slate-300 focus:ring-2 focus:ring-[#ff7700]/30 text-[#0f172a] focus:border-[#ff7700] placeholder-slate-400 shadow-xs'
        } ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
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
