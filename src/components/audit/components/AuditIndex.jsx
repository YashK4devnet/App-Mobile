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
        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#4ecdc4] hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(78,205,196,0.2)] active:scale-[0.98] transition-all duration-300 rounded-3xl p-4 flex items-center cursor-pointer group"
      >
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#4ecdc4]/20">
          {Icon && <Icon className="w-6 h-6 text-[#4ecdc4]" />}
        </div>
        
        <div className="ml-4 text-left flex-1">
          <h3 className="text-[15px] font-light text-white tracking-wide leading-tight mb-1">
            {section.title}
          </h3>
          <p className="text-[11px] text-white/50 font-light tracking-wider uppercase">
            {section.itemsCount}
          </p>
        </div>

        <div className="shrink-0 ml-3 flex items-center justify-center">
          {isCompleted ? (
            <div className="w-6 h-6 bg-[#4ecdc4] rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-[#0F0F23]" />
            </div>
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-white/30 group-hover:text-[#4ecdc4] transition-colors" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-transparent select-none pb-safe">
      {/* Progress Header (Sticky/Fixed at top) */}
      <div className="px-5 pt-6 pb-5 bg-transparent border-b border-white/10 z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-sm font-light tracking-wide text-white">Progress</h2>
            <p className="text-[11px] text-white/50 font-light tracking-wider uppercase mt-1">
              {completedSections} of {totalSections} completed
            </p>
          </div>
          <span className="text-sm font-light text-[#4ecdc4]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 scrollbar-none">
        {groups.map((group, gIdx) => (
          <React.Fragment key={group.title || gIdx}>
            <div className="mb-3.5 px-1 mt-2">
              <h3 className="text-[11px] font-light text-white/70 uppercase tracking-widest">
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
