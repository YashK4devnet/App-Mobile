import React from 'react';
import { ChevronRightIcon, BuildingIcon, LightningIcon, GlobeIcon, TrashIcon } from '../../../components/Icons';

export default function ActiveDrafts({ drafts, onResume, onDelete }) {
  const resolveIcon = (auditTypeId) => {
    switch (auditTypeId) {
      case 'venue-audit':
        return <BuildingIcon className="w-5 h-5 text-[#4ecdc4]" />;
      case 'power-audit':
        return <LightningIcon className="w-5 h-5 text-[#4ecdc4]" />;
      case 'network-audit':
        return <GlobeIcon className="w-5 h-5 text-[#4ecdc4]" />;
      default:
        return <BuildingIcon className="w-5 h-5 text-[#4ecdc4]" />;
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
      <h3 className="text-lg font-light tracking-wide text-white mb-4">
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
              className="w-full flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 hover:border-[#4ecdc4] hover:shadow-[0_4px_20px_rgba(78,205,196,0.2)] text-left cursor-pointer transition-all duration-300 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#4ecdc4]/20">
                  {resolveIcon(draft.auditTypeId)}
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-[15px] font-light text-white tracking-wide leading-tight mb-1 truncate">
                    {auditName}
                  </h4>
                  <p className="text-[11px] text-white/70 font-light tracking-wider uppercase truncate">
                    {venueName} {draft.data.reportNumber ? `• Draft No: ${draft.data.reportNumber}` : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-light text-white/50 tracking-widest uppercase mr-1">
                  {dateStr}
                </span>
                
                {/* Trash button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(draft.key);
                  }}
                  className="p-2 text-white/30 hover:text-[#ff6b6b] rounded-full hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,107,107,0.3)] active:scale-90 transition-all cursor-pointer z-10 relative"
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
