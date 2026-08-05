import React from 'react';
import { ChevronRightIcon, BuildingIcon, LightningIcon, GlobeIcon, TrashIcon } from '../../../components/Icons';

export default function ActiveDrafts({ drafts, onResume, onDelete }) {
  const resolveIcon = (auditTypeId) => {
    switch (auditTypeId) {
      case 'venue-audit':
        return <BuildingIcon className="w-5 h-5 text-[#ff7700]" />;
      case 'power-audit':
        return <LightningIcon className="w-5 h-5 text-[#ff7700]" />;
      case 'network-audit':
        return <GlobeIcon className="w-5 h-5 text-[#ff7700]" />;
      default:
        return <BuildingIcon className="w-5 h-5 text-[#ff7700]" />;
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
      <h3 className="text-lg font-bold tracking-tight text-[#0f172a] mb-4">
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
              className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-[#ff7700]/20 hover:border-[#ff7700] shadow-xs text-left cursor-pointer transition-all duration-300 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-[#ff7700]/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#ff7700]/20">
                  {resolveIcon(draft.auditTypeId)}
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-[15px] font-semibold text-[#0f172a] tracking-tight leading-tight mb-1 truncate">
                    {auditName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase truncate">
                    {venueName} {draft.data.reportNumber ? `• Draft No: ${draft.data.reportNumber}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(draft.key);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <TrashIcon className="w-4 h-4 text-rose-500" />
                </button>
                <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-[#ff7700] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
