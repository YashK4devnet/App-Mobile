import React from 'react';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormNetworkQuestion({
  label,
  name,
  value = { observation: '', remarks: '', image: '' },
  error,
  onChange,
  required = false,
  evidenceRecord,
  remarksHint
}) {
  const handleFieldChange = (field, val) => {
    onChange(name, { ...value, [field]: val });
  };

  const observations = [
    { label: 'S', value: 's' },
    { label: 'NS', value: 'ns' },
    { label: 'U', value: 'u' },
    { label: 'NA', value: 'na' }
  ];

  return (
    <div className="space-y-4 p-5 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl">
      <div>
        <div className="flex gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/50 mt-0.5">Checklist:</span>
          <div className="flex-1">
            <Label text={label} required={required} />
          </div>
        </div>
        {evidenceRecord && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">Evidence Record:</span>
            <span className="px-2 py-0.5 bg-white/10 text-white text-[11px] font-medium rounded">{evidenceRecord}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {remarksHint && (
          <p className="text-[12px] text-white/90 italic bg-[#ff6b6b]/10 p-2.5 rounded-lg border border-white/10 border-l-4 border-l-[#ff6b6b]">
            {remarksHint}
          </p>
        )}
        <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider block mb-1">Remarks</span>
        <textarea
          rows={2}
          value={value?.remarks || ''}
          onChange={(e) => handleFieldChange('remarks', e.target.value)}
          placeholder="Enter remarks here..."
          className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider block mb-1">Observation</span>
        <div className="flex gap-2">
          {observations.map(s => {
            const isActive = value?.observation === s.value;
            let activeClass = '';
            if (isActive) {
              if (s.value === 's') activeClass = 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0F0F23] shadow-sm';
              else if (s.value === 'ns') activeClass = 'bg-yellow-500 border-yellow-500 text-white shadow-sm';
              else if (s.value === 'u') activeClass = 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm';
              else activeClass = 'bg-white/20 border-white/20 text-white shadow-sm';
            } else {
              activeClass = 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10';
            }
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => handleFieldChange('observation', s.value)}
                className={`flex-1 py-2.5 px-2 text-[13px] font-medium rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <FormImageUpload
          label="Image"
          name={`${name}_image`}
          value={value?.image || ''}
          onChange={(_, imgVal) => handleFieldChange('image', imgVal)}
          error={error?.image}
        />
      </div>
    </div>
  );
}
