import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InProgressReportsList({ reports }) {
  const navigate = useNavigate();

  const handleCardClick = (report) => {
    console.log("Navigating to report:", report.reportId);
    let path = '';
    if (report.reportName.includes('Venue')) path = 'venue-audit';
    else if (report.reportName.includes('Power')) path = 'power-audit';
    else if (report.reportName.includes('Network')) path = 'network-audit';
    
    if (path) {
      navigate(path, { state: { venue: report.venue, loadDraft: true } });
    }
  };

  if (!reports || reports.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Continue Working</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.map((report) => (
          <button
            key={report.reportId}
            onClick={() => handleCardClick(report)}
            className="w-full relative overflow-hidden group p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 active:scale-[0.98] transition-all text-left flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[14px] font-semibold text-white leading-tight mb-0.5">
                  {report.reportName}
                </h3>
                <p className="text-[12px] text-white/60">
                  {report.venue.name}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-400 rounded-md">
                In Progress
              </span>
            </div>
            
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-white/50 font-medium">Progress</span>
                <span className="text-blue-400 font-bold">{report.completionPercentage}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${report.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-white/40 font-medium mt-1">
              Last updated {report.lastUpdated}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
