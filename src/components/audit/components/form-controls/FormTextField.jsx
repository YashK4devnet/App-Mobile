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
            ? 'bg-white/5 border-white/10 text-white/50 cursor-not-allowed select-none'
            : 'bg-white/5 backdrop-blur-md border-white/20 focus:ring-1 focus:ring-[#4ecdc4] text-white focus:border-[#4ecdc4] placeholder-white/40'
        } ${
          error ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''
        }`}
      />
      {error && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
