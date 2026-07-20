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
    <div className="space-y-4 p-5 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl">
      <div>
        <Label text={label} required={required} />
        {evidence && (
          <div className="flex items-center gap-2 mt-1 mb-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">Evidence:</span>
            <span className="px-2 py-0.5 bg-white/10 text-white text-[11px] font-medium rounded">{evidence}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {findingsHint && (
          <p className="text-[12px] text-white/90 italic bg-[#ff6b6b]/10 p-2.5 rounded-lg border border-white/10 border-l-4 border-l-[#ff6b6b]">
            {findingsHint}
          </p>
        )}
        <textarea
          rows={2}
          value={value?.findings || ''}
          onChange={(e) => handleFieldChange('findings', e.target.value)}
          placeholder="Enter findings here..."
          disabled={!isInteractive}
          className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {!hideScore && !showPhase && (
        <div className="space-y-1.5">
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider block mb-1">Score</span>
          <div className="flex gap-2">
          {scores.map(s => {
            const isActive = value?.score === s.value;
            let activeClass = '';
            if (isActive) {
              if (s.value === 's') activeClass = 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0F0F23] shadow-sm';
              else if (s.value === 'ns') activeClass = 'bg-yellow-500 border-yellow-500 text-white shadow-sm';
              else if (s.value === 'u') activeClass = 'bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm';
              else activeClass = 'bg-white/20 border-white/20 text-white shadow-sm';
            } else {
              activeClass = 'bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10';
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
                className={`flex-1 py-2.5 px-2 text-[13px] font-medium rounded-xl border transition-all ${isInteractive ? 'active:scale-[0.98] cursor-pointer' : ''} ${activeClass}`}
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
          <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider block mb-1">Phase</span>
          <input
            type="text"
            value={value?.phase || ''}
            onChange={(e) => handleFieldChange('phase', e.target.value)}
            placeholder="e.g. 3-phase or Single phase"
            disabled={!isInteractive}
            className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {error && typeof error === 'object' && error.score && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.score}
        </p>
      )}
      {error && typeof error === 'object' && error.findings && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.findings}
        </p>
      )}
    </div>
  );
}
