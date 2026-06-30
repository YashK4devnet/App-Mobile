import React from 'react';
import { ChevronRightIcon, BuildingIcon, LightningIcon, GlobeIcon } from '../../../components/Icons';

export default function QuickActions({ actions, onActionClick }) {
  const resolveIcon = (iconName) => {
    switch (iconName) {
      case 'building': 
        return <BuildingIcon className="w-5 h-5 text-[#F98A15]" />;
      case 'lightning': 
        return <LightningIcon className="w-5 h-5 text-[#F98A15]" />;
      case 'globe': 
        return <GlobeIcon className="w-5 h-5 text-[#F98A15]" />;
      default: 
        return null;
    }
  };

  return (
    <div className="mb-6 select-none">
      <h3 className="text-base font-bold text-slate-800 mb-3 tracking-tight">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick && onActionClick(action)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-slate-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all text-left cursor-pointer duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF4E8] rounded-xl flex items-center justify-center shrink-0">
                {resolveIcon(action.icon)}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5">
                  {action.title}
                </h4>
                <p className="text-xs text-slate-400 font-bold">
                  {action.description}
                </p>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
