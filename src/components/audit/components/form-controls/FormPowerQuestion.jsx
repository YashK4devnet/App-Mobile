import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormPowerQuestion({
  label,
  name,
  value = { score: '', findings: '', image: '' },
  error,
  onChange,
  required = false,
  evidence,
  findingsHint
}) {
  const handleFieldChange = (field, val) => {
    onChange(name, { ...value, [field]: val });
  };

  const scores = ['S', 'NS', 'U', 'NA'];

  return (
    <div className="space-y-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div>
        <Label text={label} required={required} />
        {evidence && (
          <div className="flex items-center gap-2 mt-1 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evidence:</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded">{evidence}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {findingsHint && (
          <p className="text-[12px] text-slate-600 italic bg-orange-50 p-2.5 rounded-lg border border-orange-100 border-l-4 border-l-[#F98A15]">
            {findingsHint}
          </p>
        )}
        <textarea
          rows={2}
          value={value?.findings || ''}
          onChange={(e) => handleFieldChange('findings', e.target.value)}
          placeholder="Enter findings here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Score</span>
        <div className="flex gap-2">
          {scores.map(s => {
            const isActive = value?.score === s;
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
                onClick={() => handleFieldChange('score', s)}
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
          label="Capture Evidence"
          name={`${name}_image`}
          value={value?.image || ''}
          onChange={(_, imgVal) => handleFieldChange('image', imgVal)}
          error={error?.image}
        />
      </div>

      {error && typeof error === 'string' && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {error && typeof error === 'object' && error.score && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.score}
        </p>
      )}
      {error && typeof error === 'object' && error.findings && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.findings}
        </p>
      )}
    </div>
  );
}
