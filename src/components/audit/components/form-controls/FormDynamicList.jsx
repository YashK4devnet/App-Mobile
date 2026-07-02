import React from 'react';
import { ExclamationCircleIcon, PlusIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

export function FormDynamicList({ 
  label, 
  name, 
  value = [], 
  error, 
  onChange, 
  typePlaceholder = 'e.g. Type A' 
}) {
  const handleAddItem = () => {
    onChange(name, [...value, { type: '', available: '', working: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(name, newItems);
  };

  const handleItemChange = (index, key, itemVal) => {
    const newItems = [...value];
    newItems[index] = { ...newItems[index], [key]: itemVal };
    onChange(name, newItems);
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl select-none">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={true} />
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-[12px] font-medium text-[#ff6b6b] hover:text-white active:scale-[0.98] transition-all bg-[#ff6b6b]/10 hover:bg-[#ff6b6b]/20 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Type
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/20">
          <p className="text-[13px] text-white/50 font-light">No items added yet.</p>
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 text-[12px] font-medium text-[#ff6b6b] hover:text-[#ff6b6b]/80 underline cursor-pointer"
          >
            Add your first {label.toLowerCase()}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="relative p-3 bg-white/10 border border-white/10 rounded-xl group animate-fade-in">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-[#ff6b6b] border border-white/10 text-white hover:bg-rose-600 hover:border-rose-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
              
              <div className="mb-3">
                <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Type / Details</span>
                <input
                  type="text"
                  value={item.type || ''}
                  onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                  placeholder={typePlaceholder}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Available Count</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={item.available || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      handleItemChange(index, 'available', digits);
                    }}
                    placeholder="e.g. 50"
                    className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1 block">Working Count</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={item.working || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      handleItemChange(index, 'working', digits);
                    }}
                    placeholder="e.g. 48"
                    className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] outline-none text-white placeholder-white/40"
                  />
                </div>
              </div>
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
