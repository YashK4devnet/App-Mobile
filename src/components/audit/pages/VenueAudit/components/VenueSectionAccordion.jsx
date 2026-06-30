import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, ExclamationCircleIcon } from '../../../components/Icons';

export default function VenueSectionAccordion({ 
  currentSubsection, 
  onSubsectionChange, 
  statusA1, // 'empty' | 'valid' | 'invalid'
  statusA2  // 'empty' | 'valid' | 'invalid'
}) {
  const [isOpen, setIsOpen] = useState(false);

  const subsections = [
    {
      id: 'A.1',
      title: 'A.1 LOCATION DETAILS',
      status: statusA1,
      enabled: true
    },
    {
      id: 'A.2',
      title: 'A.2 CONTACT DETAILS',
      status: statusA2,
      enabled: true
    },
    {
      id: 'B',
      title: 'PART B - INFRASTRUCTURE (Locked)',
      status: 'locked',
      enabled: false
    },
    {
      id: 'C',
      title: 'PART C - POWER SYSTEM (Locked)',
      status: 'locked',
      enabled: false
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        );
      case 'invalid':
        return (
          <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200 animate-pulse">
            <ExclamationCircleIcon className="w-3.5 h-3.5 text-rose-500" />
          </div>
        );
      case 'empty':
        return (
          <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          </div>
        );
      case 'locked':
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">🔒</span>
          </div>
        );
    }
  };

  const getSubsectionLabel = () => {
    const active = subsections.find(sub => sub.id === currentSubsection);
    return active ? active.title : 'PART A - PREFATORY AUDIT';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-4 overflow-hidden select-none">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 active:bg-slate-50 transition-colors text-left focus:outline-none"
      >
        <div>
          <span className="text-[10px] font-black text-[#F98A15] tracking-widest uppercase block mb-0.5">
            PART A - PREFATORY AUDIT
          </span>
          <h2 className="text-sm font-bold text-slate-800 leading-tight">
            {getSubsectionLabel()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Collapsible Panel */}
      {isOpen && (
        <div className="border-t border-slate-50 bg-slate-50/40 p-2 space-y-1">
          {subsections.map((sub) => {
            const isActive = currentSubsection === sub.id;
            
            return (
              <button
                key={sub.id}
                disabled={!sub.enabled}
                onClick={() => {
                  onSubsectionChange(sub.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-white shadow-[0_2px_6px_rgba(249,138,21,0.08)] border border-orange-100 text-[#F98A15]'
                    : sub.enabled
                    ? 'hover:bg-white/80 active:bg-white text-slate-600 hover:text-slate-800'
                    : 'text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <span className={`text-[13px] font-bold ${isActive ? 'font-extrabold' : ''}`}>
                  {sub.title}
                </span>
                <div className="shrink-0 ml-3">
                  {getStatusIcon(sub.status)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
