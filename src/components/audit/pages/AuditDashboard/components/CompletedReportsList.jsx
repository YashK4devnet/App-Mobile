import React from 'react';

export default function CompletedReportsList({ reports }) {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Recently Completed</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.slice(0, 3).map((report) => (
          <div
            key={report.reportId}
            className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between"
          >
            <div>
              <h3 className="text-[15px] font-medium text-white/90 leading-tight mb-0.5">
                {report.reportName}
              </h3>
              <p className="text-[12px] text-white/50">
                {report.venue.name}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="w-6 h-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#4ecdc4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[10px] text-white/40 font-medium">{report.completedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
