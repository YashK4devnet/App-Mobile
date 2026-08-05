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
  remarksHint,
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
        <div className="flex gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">Checklist:</span>
          <div className="flex-1">
            <Label text={label} required={required} />
          </div>
        </div>
        {evidenceRecord && (
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evidence Record:</span>
            <span className="px-2 py-0.5 bg-[#ff7700]/10 border border-[#ff7700]/20 text-[#ea580c] text-[11px] font-bold rounded">{evidenceRecord}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {remarksHint && (
          <p className="text-[12px] text-slate-700 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200 border-l-4 border-l-amber-500">
            {remarksHint}
          </p>
        )}
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Remarks</span>
        <textarea
          rows={2}
          value={value?.remarks || ''}
          onChange={(e) => handleFieldChange('remarks', e.target.value)}
          placeholder="Enter remarks here..."
          disabled={!isInteractive}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Observation</span>
        <textarea
          rows={2}
          value={value?.observation || ''}
          onChange={(e) => handleFieldChange('observation', e.target.value)}
          placeholder="Enter observation here..."
          disabled={!isInteractive}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs"
        />
      </div>

      <div className="pt-2">
        <FormImageUpload
          label="Image"
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
