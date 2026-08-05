import React from 'react';
import { ChevronRightIcon, FileTextIcon, BuildingIcon } from '../../../components/Icons';

export default function RecentReports({ reports, onViewAllClick, onReportClick }) {
  const resolveIcon = (iconName) => {
    if (iconName === 'building') {
      return <BuildingIcon className="w-5 h-5 text-[#ff7700]" />;
    }
    return <FileTextIcon className="w-5 h-5 text-[#ff7700]" />;
  };

  return (
    <div className="mb-6 select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold tracking-tight text-[#0f172a]">
          Recent Reports
        </h3>
        <button
          onClick={onViewAllClick}
          className="text-xs font-bold tracking-wider uppercase text-[#ff7700] hover:text-[#ea580c] active:scale-95 transition-all cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onReportClick && onReportClick(report)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-[#ff7700]/20 hover:border-[#ff7700] shadow-xs active:scale-[0.98] transition-all text-left cursor-pointer duration-300 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-[#ff7700]/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#ff7700]/20">
                {resolveIcon(report.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-semibold text-[#0f172a] tracking-tight leading-tight mb-1 truncate">
                  {report.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase">
                  Report No: {report.reportNo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
                {report.date}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-[#ff7700] transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
