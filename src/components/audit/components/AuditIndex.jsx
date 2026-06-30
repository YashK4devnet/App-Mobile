import React from 'react';
import { ChevronRightIcon, CheckIcon } from './Icons';

export default function AuditIndex({ 
  groups = [], 
  onSectionSelect, 
  progressPercent = 0 
}) {
  // Compute completed vs total sections dynamically from the configured groups
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
        className="w-full bg-white border border-slate-200 hover:border-[#F98A15]/50 active:scale-[0.98] transition-all rounded-2xl p-4 flex items-center shadow-sm cursor-pointer"
      >
        <div className="w-12 h-12 bg-[#FFF4E8] rounded-xl flex items-center justify-center shrink-0">
          {Icon && <Icon className="w-6 h-6 text-[#F98A15]" />}
        </div>
        
        <div className="ml-4 text-left flex-1">
          <h3 className="text-[14px] font-bold text-slate-800 mb-0.5 tracking-tight">
            {section.title}
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            {section.itemsCount}
          </p>
        </div>

        <div className="shrink-0 ml-3 flex items-center justify-center">
          {isCompleted ? (
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none pb-safe">
      {/* Progress Header (Sticky/Fixed at top) */}
      <div className="px-5 pt-6 pb-5 bg-slate-50 border-b border-slate-200/60 z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Progress</h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {completedSections} of {totalSections} completed
            </p>
          </div>
          <span className="text-sm font-black text-slate-800">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#F98A15] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 scrollbar-none">
        {groups.map((group, gIdx) => (
          <React.Fragment key={group.title || gIdx}>
            <div className="mb-3.5 px-1 mt-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
            </div>
            <div className="space-y-4 mb-8">
              {(group.sections || []).map(renderSectionCard)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
