import React from 'react';
import { ChevronDownIcon, CheckIcon, ExclamationCircleIcon } from './Icons';

export default function SubsectionAccordion({ 
  subsections, 
  currentSubsection, 
  isOpen, 
  onToggle, 
  onSelect 
}) {
  const currentSubObj = subsections.find(s => s.id === currentSubsection);

  return (
    <div className="relative bg-transparent border-b border-white/10 z-30">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-3.5 flex justify-between items-center text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="text-[14px] font-bold text-white tracking-tight">
          {currentSubObj?.label}
        </span>
        <ChevronDownIcon 
          className={`w-5 h-5 text-white/50 transition-transform duration-350 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0F0F23] border-b border-white/20 shadow-2xl z-40 divide-y divide-white/10 animate-slide-down max-h-[60vh] overflow-y-auto">
          {subsections.map((sub) => {
            const isActive = sub.id === currentSubsection;
            const isCompleted = sub.status === 'valid';
            const hasErrors = sub.status === 'invalid';

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelect(sub.id)}
                className={`w-full px-5 py-3 flex items-center justify-between text-[13px] transition-all hover:bg-white/5 cursor-pointer ${
                  isActive ? 'font-bold text-white bg-white/10' : 'text-white/70 font-medium'
                }`}
              >
                <span>{sub.label}</span>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="w-5 h-5 bg-[#4ecdc4] rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}
                  {hasErrors && (
                    <span className="w-5 h-5 bg-[#ff6b6b] rounded-full flex items-center justify-center">
                      <ExclamationCircleIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#ff6b6b] bg-[#ff6b6b]/20 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
