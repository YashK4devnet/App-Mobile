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

  const displayHeader = header || value?.header || 'Network Security Compliance';
  const displayRemarks = remarks || value?.remarks || value?.remark || value?.comment || value?.description || '';

  return (
    <div className="space-y-4 p-5 bg-white border border-[#ff7700]/20 rounded-2xl shadow-xs">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1.5">{displayHeader}</div>
        <div className="flex gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">Checklist:</span>
          <div className="flex-1">
            <Label text={label} required={required} />
          </div>
        </div>
        {displayRemarks ? (
          <div className="mt-3 text-[12px] text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
            {displayRemarks}
          </div>
        ) : null}
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
