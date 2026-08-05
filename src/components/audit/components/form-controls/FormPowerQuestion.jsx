import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormPowerQuestion({
  label,
  name,
  value = { score: '', findings: '', image: '', phase: '' },
  error,
  onChange,
  required = false,
  evidence,
  findingsHint,
  readOnly = false,
  disabled = false,
  hideScore = false,
  showPhase = false
}) {
  const isInteractive = !readOnly && !disabled;

  const handleFieldChange = (field, val) => {
    if (!isInteractive) return;
    onChange(name, { ...value, [field]: val });
  };

  const scores = [
    { label: 'S', value: 's' },
    { label: 'NS', value: 'ns' },
    { label: 'U', value: 'u' },
    { label: 'NA', value: 'na' }
  ];

  return (
    <div className="space-y-4 p-5 bg-white border border-[#ff7700]/20 rounded-2xl shadow-xs">
      <div>
        <Label text={label} required={required} />
        {evidence && (
          <div className="flex items-center gap-2 mt-1 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evidence:</span>
            <span className="px-2 py-0.5 bg-[#ff7700]/10 border border-[#ff7700]/20 text-[#ea580c] text-[11px] font-bold rounded">{evidence}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {findingsHint && (
          <p className="text-[12px] text-slate-700 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200 border-l-4 border-l-amber-500">
            {findingsHint}
          </p>
        )}
        <textarea
          rows={2}
          value={value?.findings || ''}
          onChange={(e) => handleFieldChange('findings', e.target.value)}
          placeholder="Enter findings here..."
          disabled={!isInteractive}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
        />
      </div>

      {!hideScore && !showPhase && (
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Score</span>
          <div className="flex gap-2">
          {scores.map(s => {
            const isActive = value?.score === s.value;
            let activeClass = '';
            if (isActive) {
              if (s.value === 's') activeClass = 'bg-emerald-500 border-emerald-500 text-white shadow-xs';
              else if (s.value === 'ns') activeClass = 'bg-amber-500 border-amber-500 text-white shadow-xs';
              else if (s.value === 'u') activeClass = 'bg-rose-500 border-rose-500 text-white shadow-xs';
              else activeClass = 'bg-slate-700 border-slate-700 text-white shadow-xs';
            } else {
              activeClass = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs';
            }
            
            if (!isInteractive) {
              activeClass += ' opacity-70 cursor-not-allowed';
            }
            
            return (
              <button
                key={s.value}
                type="button"
                disabled={!isInteractive}
                onClick={() => handleFieldChange('score', s.value)}
                className={`flex-1 py-2.5 px-2 text-[13px] font-bold rounded-xl border transition-all ${isInteractive ? 'active:scale-[0.98] cursor-pointer' : ''} ${activeClass}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
      )}
      
      {showPhase && (
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Phase</span>
          <input
            type="text"
            value={value?.phase || ''}
            onChange={(e) => handleFieldChange('phase', e.target.value)}
            placeholder="e.g. 3-phase or Single phase"
            disabled={!isInteractive}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
          />
        </div>
      )}

      <div className="pt-2">
        <FormImageUpload
          label="Capture Evidence"
          name={`${name}_image`}
          value={value?.image || ''}
          onChange={(_, imgVal) => handleFieldChange('image', imgVal)}
          error={error?.image}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>

      {error && typeof error === 'string' && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {error && typeof error === 'object' && error.score && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.score}
        </p>
      )}
      {error && typeof error === 'object' && error.findings && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.findings}
        </p>
      )}
    </div>
  );
}
