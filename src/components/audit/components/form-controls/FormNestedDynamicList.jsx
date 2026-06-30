import React from 'react';
import { ExclamationCircleIcon, PlusIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

export function FormNestedDynamicList({ 
  label, 
  name, 
  value = [], 
  error, 
  onChange 
}) {
  const handleAddFloor = () => {
    onChange(name, [...value, { floorName: '', labs: [{ labName: '', nodesCount: '' }] }]);
  };

  const handleRemoveFloor = (floorIndex) => {
    const newFloors = value.filter((_, i) => i !== floorIndex);
    onChange(name, newFloors);
  };

  const handleFloorChange = (floorIndex, newName) => {
    const newFloors = [...value];
    newFloors[floorIndex] = { ...newFloors[floorIndex], floorName: newName };
    onChange(name, newFloors);
  };

  const handleAddLab = (floorIndex) => {
    const newFloors = [...value];
    newFloors[floorIndex].labs = [...newFloors[floorIndex].labs, { labName: '', nodesCount: '' }];
    onChange(name, newFloors);
  };

  const handleRemoveLab = (floorIndex, labIndex) => {
    const newFloors = [...value];
    newFloors[floorIndex].labs = newFloors[floorIndex].labs.filter((_, i) => i !== labIndex);
    onChange(name, newFloors);
  };

  const handleLabChange = (floorIndex, labIndex, key, labVal) => {
    const newFloors = [...value];
    newFloors[floorIndex].labs[labIndex] = { ...newFloors[floorIndex].labs[labIndex], [key]: labVal };
    onChange(name, newFloors);
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm select-none">
      <div className="flex justify-between items-center mb-1">
        <Label text={label} required={true} />
        <button
          type="button"
          onClick={handleAddFloor}
          className="flex items-center gap-1 text-[12px] font-bold text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Floor
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-[13px] text-slate-500 font-medium">No floors added yet.</p>
          <button
            type="button"
            onClick={handleAddFloor}
            className="mt-2 text-[12px] font-bold text-[#F98A15] underline cursor-pointer"
          >
            Add the first floor
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {value.map((floor, fIndex) => (
            <div key={fIndex} className="relative p-4 bg-white border border-slate-200 rounded-xl animate-fade-in shadow-sm">
              <button
                type="button"
                onClick={() => handleRemoveFloor(fIndex)}
                className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 block">Floor Name</span>
                <input
                  type="text"
                  value={floor.floorName || ''}
                  onChange={(e) => handleFloorChange(fIndex, e.target.value)}
                  placeholder="e.g. 1st Floor, Ground Floor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] transition-all focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2 mt-4 border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Labs on this floor</span>
                  <button
                    type="button"
                    onClick={() => handleAddLab(fIndex)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#F98A15] hover:text-orange-600 bg-[#FFF4E8] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add Lab
                  </button>
                </div>

                {(!floor.labs || floor.labs.length === 0) ? (
                  <p className="text-[12px] text-red-500 italic">Please add at least one lab.</p>
                ) : (
                  floor.labs.map((lab, lIndex) => (
                    <div key={lIndex} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100 relative group">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            value={lab.labName || ''}
                            onChange={(e) => handleLabChange(fIndex, lIndex, 'labName', e.target.value)}
                            placeholder="Lab Name (e.g. Lab A)"
                            className="w-full bg-white border border-slate-200 rounded text-[12px] px-2 py-1.5 outline-none focus:border-[#F98A15]"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={lab.nodesCount || ''}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '');
                              handleLabChange(fIndex, lIndex, 'nodesCount', digits);
                            }}
                            placeholder="Nodes Count (e.g. 50)"
                            className="w-full bg-white border border-slate-200 rounded text-[12px] px-2 py-1.5 outline-none focus:border-[#F98A15]"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLab(fIndex, lIndex)}
                        className="w-6 h-6 shrink-0 text-slate-300 hover:text-rose-500 rounded flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
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
