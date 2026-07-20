import React from 'react';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormNetworkSecurityQuestion({
  label,
  name,
  value = { image: '' },
  error,
  onChange,
  required = false,
  header,
  remarks,
  readOnly = false,
  disabled = false
}) {
  const isInteractive = !readOnly && !disabled;

  const handleFieldChange = (field, val) => {
    if (!isInteractive) return;
    onChange(name, { ...value, [field]: val });
  };

  return (
    <div className="space-y-4 p-5 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl">
      <div>
        {header && <div className="text-[11px] font-bold uppercase tracking-wider text-[#ff6b6b] mb-1">{header}</div>}
        <div className="flex gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/50 mt-0.5">Checklist:</span>
          <div className="flex-1">
            <Label text={label} required={required} />
          </div>
        </div>
        {remarks && (
          <div className="mt-3 text-[12px] text-white/80 bg-white/5 p-3 rounded-lg border border-white/10 whitespace-pre-wrap">
            {remarks}
          </div>
        )}
      </div>

      <div className="pt-2">
        <FormImageUpload
          label="Evidence Image"
          name={`${name}_image`}
          value={value?.image || ''}
          onChange={(_, imgVal) => handleFieldChange('image', imgVal)}
          error={error?.image}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
