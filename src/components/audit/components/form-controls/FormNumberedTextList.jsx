import React from 'react';
import { ExclamationCircleIcon, PlusIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

export function FormNumberedTextList({
  label,
  name,
  value = [],
  error,
  onChange,
  required = false
}) {
  const handleAddItem = () => {
    onChange(name, [...value, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(name, newItems);
  };

  const handleItemChange = (index, val) => {
    const newItems = [...value];
    newItems[index] = val;
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
          Add Line
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-[13px] text-slate-500 font-medium">No observations added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-3 animate-fade-in">
              <span className="text-[14px] font-bold text-[#F98A15] min-w-[20px] text-right">{index + 1}.</span>
              <input
                type="text"
                value={item || ''}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`Enter observation #${index + 1}`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
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
