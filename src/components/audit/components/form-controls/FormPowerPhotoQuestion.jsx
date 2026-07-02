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
          className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
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
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
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
