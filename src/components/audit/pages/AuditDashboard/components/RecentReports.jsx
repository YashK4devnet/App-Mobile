import React from 'react';
import { ChevronRightIcon, FileTextIcon, BuildingIcon } from '../../../components/Icons';

export default function RecentReports({ reports, onViewAllClick, onReportClick }) {
  const resolveIcon = (iconName) => {
    if (iconName === 'building') {
      return <BuildingIcon className="w-5 h-5 text-[#F98A15]" />;
    }
    return <FileTextIcon className="w-5 h-5 text-[#F98A15]" />;
  };

  return (
    <div className="mb-6 select-none">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          Recent Reports
        </h3>
        <button
          onClick={onViewAllClick}
          className="text-xs font-bold text-[#F98A15] hover:text-[#E07A0F] active:scale-95 transition-all cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onReportClick && onReportClick(report)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-slate-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all text-left cursor-pointer duration-200"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-[#FFF4E8] rounded-xl flex items-center justify-center shrink-0">
                {resolveIcon(report.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5 truncate">
                  {report.title}
                </h4>
                <p className="text-xs text-slate-400 font-bold">
                  Report No: {report.reportNo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-400">
                {report.date}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
