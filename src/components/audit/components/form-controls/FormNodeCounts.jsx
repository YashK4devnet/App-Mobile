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
    <div className="space-y-2 p-4 bg-white border border-[#ff7700]/20 rounded-2xl shadow-xs select-none">
      <Label text={label} required={required} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Available</span>
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
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 outline-none text-[#0f172a] placeholder-slate-400 ${
              error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-[#ff7700]'
            } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
          />
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Working</span>
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
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 outline-none text-[#0f172a] placeholder-slate-400 ${
              error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-[#ff7700]'
            } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
          />
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
