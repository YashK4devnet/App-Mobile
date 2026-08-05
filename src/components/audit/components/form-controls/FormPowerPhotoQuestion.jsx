import React from 'react';
import { ExclamationCircleIcon } from '../Icons';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormPowerPhotoQuestion({
  label,
  name,
  value = { findings: '', image: '' },
  error,
  onChange,
  required = false,
  evidence,
  findingsHint,
  readOnly = false,
  disabled = false
}) {
  const isInteractive = !readOnly && !disabled;

  const handleFieldChange = (field, val) => {
    if (!isInteractive) return;
    onChange(name, { ...value, [field]: val });
  };

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
      {error && typeof error === 'object' && error.findings && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.findings}
        </p>
      )}
    </div>
  );
}
