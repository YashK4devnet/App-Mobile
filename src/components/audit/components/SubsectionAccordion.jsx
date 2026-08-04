import React, { useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, ExclamationCircleIcon } from './Icons';

export default function SubsectionAccordion({ 
  subsections, 
  currentSubsection, 
  isOpen, 
  onToggle, 
  onSelect 
}) {
  const activeItemRef = useRef(null);
  const listContainerRef = useRef(null);

  const currentIndex = subsections.findIndex(s => s.id === currentSubsection);
  const currentSubObj = subsections[currentIndex !== -1 ? currentIndex : 0];
  const totalCount = subsections.length;

  // Auto-scroll to current active section when accordion opens or active section changes
  useEffect(() => {
    if (isOpen && activeItemRef.current && listContainerRef.current) {
      const timer = setTimeout(() => {
        activeItemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentSubsection]);

  return (
    <div className="relative bg-transparent border-b border-white/10 z-30">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-3 flex justify-between items-center text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#ff7700] uppercase tracking-wider bg-[#ff7700]/10 px-2 py-0.5 rounded border border-[#ff7700]/20">
              Section {currentIndex !== -1 ? currentIndex + 1 : 1} of {totalCount}
            </span>
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight">
            {currentSubObj?.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDownIcon 
            className={`w-5 h-5 text-white/50 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#ff7700]' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="relative z-40">
          <div 
            ref={listContainerRef}
            className="absolute top-0 left-0 right-0 bg-[#0e0e12] border-b border-white/20 shadow-2xl z-40 divide-y divide-white/10 animate-slide-down max-h-[45vh] sm:max-h-[calc(100vh-280px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#ff7700]/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5"
          >
            {subsections.map((sub, index) => {
              const isActive = sub.id === currentSubsection;
              const isCompleted = sub.status === 'valid';
              const hasErrors = sub.status === 'invalid';

              return (
                <button
                  key={sub.id}
                  ref={isActive ? activeItemRef : null}
                  type="button"
                  onClick={() => onSelect(sub.id)}
                  className={`w-full px-5 py-3.5 flex items-center justify-between text-[13px] transition-all hover:bg-white/10 cursor-pointer ${
                    isActive 
                      ? 'font-bold text-white bg-white/15 border-l-4 border-l-[#ff7700] pl-4' 
                      : 'text-white/70 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2 text-left pr-2">
                    <span>{sub.label}</span>
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {isCompleted && (
                      <span className="w-5 h-5 bg-[#ff7700] rounded-full flex items-center justify-center shadow-sm">
                        <CheckIcon className="w-3.5 h-3.5 text-[#08080a]" />
                      </span>
                    )}
                    {hasErrors && (
                      <span className="w-5 h-5 bg-[#ff4444] rounded-full flex items-center justify-center shadow-sm">
                        <ExclamationCircleIcon className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#ff7700] bg-[#ff7700]/20 px-2 py-0.5 rounded border border-[#ff7700]/30">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
