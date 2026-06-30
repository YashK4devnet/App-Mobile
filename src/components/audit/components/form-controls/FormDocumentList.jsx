import React from 'react';
import { ExclamationCircleIcon, PlusIcon, TrashIcon } from '../Icons';
import { Label } from './Label';
import { FormImageUpload } from './FormImageUpload';

export function FormDocumentList({
  label,
  name,
  value = [],
  error,
  onChange,
  required = false
}) {
  const handleAddItem = () => {
    onChange(name, [...value, { documentName: '', documentImage: null }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(name, newItems);
  };

  const handleItemChange = (index, key, val) => {
    const newItems = [...value];
    newItems[index] = { ...newItems[index], [key]: val };
    onChange(name, newItems);
  };

  return (
    <div className="space-y-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-left">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={required} />
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-[12px] font-bold text-[#F98A15] hover:text-orange-600 active:scale-[0.98] transition-all bg-[#FFF4E8] px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Document
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-[13px] text-slate-500 font-medium">No documents added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((item, index) => (
            <div key={index} className="relative p-4 bg-slate-50 border border-slate-200/60 rounded-xl animate-fade-in">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Document Name</span>
                  <input
                    type="text"
                    value={item.documentName || ''}
                    onChange={(e) => handleItemChange(index, 'documentName', e.target.value)}
                    placeholder="Enter document name (e.g. DG Nameplate, Panel Diagram)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#F98A15] text-slate-800"
                  />
                </div>

                <div>
                  <FormImageUpload
                    label="Document Image"
                    name={`${name}_row_${index}`}
                    value={item.documentImage}
                    onChange={(_, imgVal) => handleItemChange(index, 'documentImage', imgVal)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-semibold mt-2 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
