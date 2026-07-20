import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';

export function FormNodeCounts({ 
  label, 
  value, 
  error, 
  onChange, 
  required = false,
  readOnly = false
}) {
  const valObj = typeof value === 'object' && value !== null ? value : {};
  const availVal = valObj.Available || '';
  const workVal = valObj.Working || '';

  const handleAvailChange = (val) => {
    if (readOnly) return;
    onChange({ ...valObj, Available: val });
  };

  const handleWorkChange = (val) => {
    if (readOnly) return;
    onChange({ ...valObj, Working: val });
  };

  return (
    <div className="space-y-2 p-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl select-none">
      <Label text={label} required={required} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Available</span>
          <input
            type="text"
            value={availVal}
            disabled={readOnly}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              handleAvailChange(digits);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 50"
            className={`w-full bg-white/5 backdrop-blur-md border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] outline-none text-white placeholder-white/40 ${
              error ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : 'border-white/20 focus:border-[#4ecdc4]'
            } disabled:opacity-50`}
          />
        </div>
        <div>
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Working</span>
          <input
            type="text"
            value={workVal}
            disabled={readOnly}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              handleWorkChange(digits);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 48"
            className={`w-full bg-white/5 backdrop-blur-md border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] outline-none text-white placeholder-white/40 ${
              error ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : 'border-white/20 focus:border-[#4ecdc4]'
            } disabled:opacity-50`}
          />
        </div>
      </div>
      {error && <p className="text-xs text-[#ff6b6b] mt-1">{error}</p>}
    </div>
  );
}
