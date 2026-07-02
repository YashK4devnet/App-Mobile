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
        className={`w-full bg-white/5 backdrop-blur-md border rounded-xl px-4 py-3 text-[14px] transition-all focus:ring-1 focus:ring-[#4ecdc4] outline-none text-white placeholder-white/40 ${
          error ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : 'border-white/20 focus:border-[#4ecdc4]'
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
