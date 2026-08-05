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
    <div className="space-y-4 p-5 bg-white border border-[#ff7700]/20 rounded-2xl text-left shadow-xs">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={required} />
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-[12px] font-bold text-[#ff7700] hover:text-[#ea580c] active:scale-[0.98] transition-all bg-[#ff7700]/10 hover:bg-[#ff7700]/20 border border-[#ff7700]/20 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Line
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-[#f8fafc] rounded-xl border border-dashed border-slate-300">
          <p className="text-[13px] text-slate-500 font-medium">No observations added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-3 animate-fade-in">
              <span className="text-[14px] font-bold text-[#ea580c] min-w-[20px] text-right">{index + 1}.</span>
              <input
                type="text"
                value={item || ''}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`Enter observation #${index + 1}`}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-2 focus:ring-[#ff7700]/30 focus:border-[#ff7700] outline-none text-[#0f172a] placeholder-slate-400 shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="w-8 h-8 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center shadow-xs cursor-pointer transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-500 font-medium mt-2 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
