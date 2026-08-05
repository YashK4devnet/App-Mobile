import React from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
    case 'Waiting for Approval': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    case 'Assigned': return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    case 'In Progress': return 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20';
    case 'Rejected': return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
    case 'Completed': return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
    default: return 'text-slate-600 bg-slate-100 border-slate-200';
  }
};

export default React.memo(function ReportCard({ report, onClick }) {
  const statusClasses = getStatusColor(report.status);

  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-[#ff7700]/20 rounded-2xl p-4 cursor-pointer hover:border-[#ff7700]/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] animate-fade-in group relative overflow-hidden shadow-xs"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-[#0f172a] font-bold text-[16px] leading-tight">
            {report.auditType}
          </h3>
          {report.reportName && (
            <p className="text-[#0f172a] text-[14px] mt-1 font-medium">
              {report.reportName}
            </p>
          )}
          <p className="text-slate-500 text-[12px] mt-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ID: {report.id}
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ml-3 ${statusClasses}`}>
          {report.status}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[13px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {report.progress > 0 && report.progress < 100 && (
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
          <div 
            className="bg-[#ff7700] h-full rounded-full transition-all duration-300"
            style={{ width: `${report.progress}%` }}
          />
        </div>
      )}
    </div>
  );
});
