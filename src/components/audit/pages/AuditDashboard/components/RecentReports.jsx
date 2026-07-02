import React from 'react';
import { ChevronRightIcon, FileTextIcon, BuildingIcon } from '../../../components/Icons';

export default function RecentReports({ reports, onViewAllClick, onReportClick }) {
  const resolveIcon = (iconName) => {
    if (iconName === 'building') {
      return <BuildingIcon className="w-5 h-5 text-[#4ecdc4]" />;
    }
    return <FileTextIcon className="w-5 h-5 text-[#4ecdc4]" />;
  };

  return (
    <div className="mb-6 select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-light tracking-wide text-white">
          Recent Reports
        </h3>
        <button
          onClick={onViewAllClick}
          className="text-xs font-light tracking-wider uppercase text-[#4ecdc4] hover:text-[#ff6b6b] active:scale-95 transition-all cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onReportClick && onReportClick(report)}
            className="w-full flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-[#4ecdc4] hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(78,205,196,0.2)] active:scale-[0.98] transition-all text-left cursor-pointer duration-300 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#4ecdc4]/20">
                {resolveIcon(report.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-light text-white tracking-wide leading-tight mb-1 truncate">
                  {report.title}
                </h4>
                <p className="text-[11px] text-white/70 font-light tracking-wider uppercase">
                  Report No: {report.reportNo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-light text-white/50 tracking-widest uppercase">
                {report.date}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#4ecdc4] transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
