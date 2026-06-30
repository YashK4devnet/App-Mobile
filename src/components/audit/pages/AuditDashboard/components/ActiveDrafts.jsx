import React from 'react';
import { ChevronRightIcon, BuildingIcon, LightningIcon, GlobeIcon, TrashIcon } from '../../../components/Icons';

export default function ActiveDrafts({ drafts, onResume, onDelete }) {
  const resolveIcon = (auditTypeId) => {
    switch (auditTypeId) {
      case 'venue-audit':
        return <BuildingIcon className="w-5 h-5 text-[#F98A15]" />;
      case 'power-audit':
        return <LightningIcon className="w-5 h-5 text-[#F98A15]" />;
      case 'network-audit':
        return <GlobeIcon className="w-5 h-5 text-[#F98A15]" />;
      default:
        return <BuildingIcon className="w-5 h-5 text-[#F98A15]" />;
    }
  };

  const getAuditDisplayName = (auditTypeId) => {
    switch (auditTypeId) {
      case 'venue-audit':
        return 'Venue Audit';
      case 'power-audit':
        return 'Power System Audit';
      case 'network-audit':
        return 'Network System Audit';
      default:
        return 'Audit';
    }
  };

  return (
    <div className="mb-6 select-none animate-fade-in">
      <h3 className="text-base font-bold text-slate-800 mb-3 tracking-tight">
        Active Drafts
      </h3>
      <div className="space-y-3">
        {drafts.map((draft) => {
          const venueName = draft.data.venueName || 'New Venue / Other Location';
          const auditName = getAuditDisplayName(draft.auditTypeId);
          const dateStr = draft.data.auditDate || 'No Date';

          return (
            <div
              key={draft.key}
              onClick={() => onResume(draft)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-50 text-left cursor-pointer hover:shadow-md hover:border-orange-100 transition-all duration-200 active:scale-[0.99] group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-[#FFF4E8] rounded-xl flex items-center justify-center shrink-0">
                  {resolveIcon(draft.auditTypeId)}
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5 truncate">
                    {auditName}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold truncate">
                    {venueName} {draft.data.reportNumber ? `• Draft No: ${draft.data.reportNumber}` : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  {dateStr}
                </span>
                
                {/* Trash button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(draft.key);
                  }}
                  className="p-2 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50/50 active:scale-90 transition-all cursor-pointer z-10 relative"
                  title="Discard Draft"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
