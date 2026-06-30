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
  findingsHint
}) {
  const handleFieldChange = (field, val) => {
    onChange(name, { ...value, [field]: val });
  };

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
      {error && typeof error === 'object' && error.findings && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error.findings}
        </p>
      )}
    </div>
  );
}
