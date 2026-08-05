import React from 'react';
import { ChevronRightIcon, CheckIcon } from './Icons';

export default function AuditIndex({ 
  groups = [], 
  onSectionSelect, 
  progressPercent = 0 
}) {
  const allSections = groups.flatMap(g => g.sections || []);
  const totalSections = allSections.length;
  const completedSections = allSections.filter(s => s.status === 'valid').length;

  const renderSectionCard = (section) => {
    const Icon = section.icon;
    const isCompleted = section.status === 'valid';

    return (
      <button
        key={section.id}
        onClick={() => onSectionSelect(section.id)}
        className="w-full bg-white border border-[#ff7700]/20 hover:border-[#ff7700] hover:shadow-md active:scale-[0.98] transition-all duration-300 rounded-3xl p-4 flex items-center cursor-pointer group shadow-xs"
      >
        <div className="w-12 h-12 bg-[#ff7700]/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#ff7700]/20">
          {Icon && <Icon className="w-6 h-6 text-[#ff7700]" />}
        </div>
        
        <div className="ml-4 text-left flex-1">
          <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-tight leading-tight mb-1">
            {section.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase">
            {section.itemsCount}
          </p>
        </div>

        <div className="shrink-0 ml-3 flex items-center justify-center">
          {isCompleted ? (
            <div className="w-6 h-6 bg-[#ff7700] rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-[#ff7700] transition-colors" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-transparent select-none pb-safe">
      {/* Progress Header */}
      <div className="px-5 pt-6 pb-5 bg-transparent border-b border-[#ff7700]/18 z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-[#0f172a]">Progress</h2>
            <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase mt-1">
              {completedSections} of {totalSections} completed
            </p>
          </div>
          <span className="text-xl font-bold text-[#ea580c]">{progressPercent}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
          <div 
            className="bg-[#ff7700] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-6">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">
            {group.title && (
              <h3 className="text-[12px] font-bold tracking-wider text-slate-500 uppercase px-1">
                {group.title}
              </h3>
            )}
            <div className="space-y-3">
              {(group.sections || []).map(renderSectionCard)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
