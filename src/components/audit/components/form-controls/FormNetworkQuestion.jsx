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

  const observations = ['S', 'NS', 'U', 'NA'];

  return (
    <div className="space-y-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div>
        <div className="flex gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">Checklist:</span>
          <div className="flex-1">
            <Label text={label} required={required} />
          </div>
        </div>
        {evidenceRecord && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evidence Record:</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded">{evidenceRecord}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {remarksHint && (
          <p className="text-[12px] text-slate-600 italic bg-orange-50 p-2.5 rounded-lg border border-orange-100 border-l-4 border-l-[#F98A15]">
            {remarksHint}
          </p>
        )}
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Remarks</span>
        <textarea
          rows={2}
          value={value?.remarks || ''}
          onChange={(e) => handleFieldChange('remarks', e.target.value)}
          placeholder="Enter remarks here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Observation</span>
        <div className="flex gap-2">
          {observations.map(s => {
            const isActive = value?.observation === s;
            let activeClass = '';
            if (isActive) {
              if (s === 'S') activeClass = 'bg-emerald-500 border-emerald-500 text-white shadow-sm';
              else if (s === 'NS') activeClass = 'bg-[#F98A15] border-[#F98A15] text-white shadow-sm';
              else if (s === 'U') activeClass = 'bg-rose-500 border-rose-500 text-white shadow-sm';
              else activeClass = 'bg-slate-500 border-slate-500 text-white shadow-sm';
            } else {
              activeClass = 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
            }
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleFieldChange('observation', s)}
                className={`flex-1 py-2.5 px-2 text-[13px] font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${activeClass}`}
              >
                {s}
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
