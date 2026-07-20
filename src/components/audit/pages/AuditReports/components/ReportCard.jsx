import React from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Waiting for Approval': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'Assigned': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'In Progress': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    case 'Rejected': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    case 'Completed': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default: return 'text-white/70 bg-white/5 border-white/10';
  }
};

export default React.memo(function ReportCard({ report, onClick }) {
  const statusClasses = getStatusColor(report.status);

  return (
    <div
      onClick={onClick}
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in group relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#4ecdc4]/10 transition-colors" />

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-medium text-[16px] leading-tight">
            {report.auditType}
          </h3>
          {report.reportName && (
            <p className="text-white/90 text-[14px] mt-1 font-medium">
              {report.reportName}
            </p>
          )}
          <p className="text-white/50 text-[12px] mt-1.5 flex items-center gap-1.5">
            {/* SVG for Document */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {report.id}
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ml-3 ${statusClasses}`}>
          {report.status}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[13px] text-white/70">

        <div className="flex items-center gap-1.5">
          {/* SVG for Date */}
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {report.progress > 0 && report.progress < 100 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center mb-1 text-[11px] font-medium">
            <span className="text-white/60">Progress</span>
            <span className="text-[#4ecdc4]">{report.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4ecdc4] h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${report.progress}%` }}
            />
          </div>
        </div>
      )}

      {report.issuesFound > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[12px] text-white/50">Issues Identified</span>
          <span className="text-[12px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {report.issuesFound}
          </span>
        </div>
      )}
    </div>
  );
});
