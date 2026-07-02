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
    <div className="space-y-4 p-5 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl text-left">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={required} />
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-[12px] font-medium text-[#ff6b6b] hover:text-white active:scale-[0.98] transition-all bg-[#ff6b6b]/10 hover:bg-[#ff6b6b]/20 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Line
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/20">
          <p className="text-[13px] text-white/50 font-light">No observations added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-3 animate-fade-in">
              <span className="text-[14px] font-medium text-[#4ecdc4] min-w-[20px] text-right">{index + 1}.</span>
              <input
                type="text"
                value={item || ''}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`Enter observation #${index + 1}`}
                className="flex-1 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="w-8 h-8 bg-white/5 border border-white/20 text-white/50 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/20 hover:border-[#ff6b6b]/50 rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-2 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
