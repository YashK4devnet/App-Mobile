import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

export function FormBifurcation({
  label,
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  error
}) {
  const location = useLocation();
  const odooData = location.state?.odooData || null;
  const labSummary = odooData?.labSummary || odooData?.lab_summary;
  const allLabs = labSummary?.allLabs || [];
  const allFloors = labSummary?.allFloors || [];

  const lines = Array.isArray(value) ? value : [];

  const handleAddLine = () => {
    if (readOnly) return;
    const newLines = [...lines, { labId: '', floorId: '', count: '' }];
    onChange(name, newLines);
  };

  const handleRemoveLine = (index) => {
    if (readOnly) return;
    const newLines = lines.filter((_, i) => i !== index);
    onChange(name, newLines);
  };

  const handleChange = (index, field, val) => {
    if (readOnly) return;
    
    const newLines = [...lines];
    const parsedVal = val === '' ? '' : parseInt(val, 10);
    newLines[index] = { ...newLines[index], [field]: isNaN(parsedVal) ? '' : parsedVal };
    
    onChange(name, newLines);
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl select-none">
      <Label text={label} required={required} />
      
      {lines.map((line, index) => (
        <div key={line.id ? `line-${line.id}` : `new-${index}`} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
          {/* Lab */}
          <div className="flex-1">
            <label className="text-[10px] text-white/50 uppercase tracking-wider mb-1 block font-medium">Lab</label>
            <select
              value={line.labId || ''}
              onChange={(e) => handleChange(index, 'labId', e.target.value)}
              disabled={readOnly}
              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-[13px] text-white focus:outline-none focus:border-[#4ecdc4] disabled:opacity-50"
            >
              <option value="" disabled className="text-black">Select Lab</option>
              {allLabs.map((lab) => (
                <option key={lab.id} value={lab.id} className="text-black">
                  {lab.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="flex-1">
            <label className="text-[10px] text-white/50 uppercase tracking-wider mb-1 block font-medium">Floor</label>
            <select
              value={line.floorId || ''}
              onChange={(e) => handleChange(index, 'floorId', e.target.value)}
              disabled={readOnly}
              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-[13px] text-white focus:outline-none focus:border-[#4ecdc4] disabled:opacity-50"
            >
              <option value="" disabled className="text-black">Select Floor</option>
              {allFloors.map((floor) => (
                <option key={floor.id} value={floor.id} className="text-black">
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Count */}
          <div className="flex-1">
            <label className="text-[10px] text-white/50 uppercase tracking-wider mb-1 block font-medium">Count</label>
            <input
              type="number"
              value={line.count || ''}
              onChange={(e) => handleChange(index, 'count', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. 5"
              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-[13px] text-white focus:outline-none focus:border-[#4ecdc4]"
            />
          </div>

          {/* Remove */}
          {!readOnly && (
            <button
              type="button"
              onClick={() => handleRemoveLine(index)}
              className="mt-5 p-1.5 text-white/40 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      {lines.length === 0 && (
        <div className="text-center py-4 text-white/40 text-[13px] italic bg-black/20 rounded-lg border border-white/5">
          No lines added yet. Click below to add one.
        </div>
      )}

      {error && <span className="text-xs text-[#ff6b6b]">{error}</span>}

      {!readOnly && (
        <button
          type="button"
          onClick={handleAddLine}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[13px] font-medium text-white transition-colors w-full justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          Add Line
        </button>
      )}
    </div>
  );
}
