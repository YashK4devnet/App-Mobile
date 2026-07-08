import React from 'react';
import { Label } from './Label';

export function FormSelectWithCounts({ 
  label, 
  name, 
  value = {}, 
  error, 
  onChange, 
  options = []
}) {
  const handleItemChange = (key, itemVal) => {
    const newValue = { ...value, [key]: itemVal };
    onChange(name, newValue);
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl select-none">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={true} />
      </div>

      <div className="p-3 bg-white/10 border border-white/10 rounded-xl group animate-fade-in">
        <div className="mb-3">
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Resolution</span>
          <select
            value={value.type || ''}
            onChange={(e) => handleItemChange('type', e.target.value)}
            className="w-full bg-[#1a1f2e] border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white appearance-none"
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Available Count</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value.available || ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                handleItemChange('available', digits);
              }}
              placeholder="e.g. 50"
              className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
            />
          </div>
          <div>
            <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Working Count</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value.working || ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                handleItemChange('working', digits);
              }}
              placeholder="e.g. 48"
              className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
            />
          </div>
        </div>
      </div>
      {error && <span className="text-xs text-[#ff6b6b] mt-1 ml-1 block">{error}</span>}
    </div>
  );
}
