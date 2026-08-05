import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApiService } from '../../../services/reportApiService';

export default function InProgressReportsList({ reports }) {
  const navigate = useNavigate();
  const [fetchingId, setFetchingId] = useState(null);

  const handleCardClick = async (report) => {
    try {
      setFetchingId(report.id || report.reportId);

      // Fetch full report data first
      const reportData = await reportApiService.fetchReport(report.id || report.reportId);

      let path = '';
      if (reportData.reportType === 'network_audit') path = `/audit/network-audit/${reportData.id}`;
      else if (reportData.reportType === 'power_audit') path = `/audit/power-audit/${reportData.id}`;
      else if (reportData.reportType === 'venue_audit') path = `/audit/venue-audit/${reportData.id}`;
      else {
        if (reportData.reportType === 'network') path = `/audit/network-audit/${reportData.id}`;
        else if (reportData.reportType === 'power') path = `/audit/power-audit/${reportData.id}`;
        else if (reportData.reportType === 'venue') path = `/audit/venue-audit/${reportData.id}`;
        else path = `/audit/${reportData.reportType || 'network'}-audit/${reportData.id}`;
      }

      navigate(path, { state: { odooData: reportData } });

    } catch (err) {
      console.error("Failed to load report", err);
      alert("Failed to load report. Please try again.");
    } finally {
      setFetchingId(null);
    }
  };

  if (!reports || reports.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-widest">Continue Working</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.map((report) => (
          <button
            key={report.id || report.reportId}
            onClick={() => handleCardClick(report)}
            disabled={fetchingId === (report.id || report.reportId)}
            className={`w-full relative overflow-hidden group p-4 bg-white border border-[#ff7700]/20 rounded-2xl hover:border-[#ff7700]/40 transition-all text-left flex flex-col gap-2 shadow-xs ${fetchingId === (report.id || report.reportId) ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[15px] font-semibold text-[#0f172a] leading-tight mb-1 flex items-center gap-2">
                  {report.reportName}
                  {fetchingId === (report.id || report.reportId) && (
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#ff7700] rounded-full animate-spin" />
                  )}
                </h3>
                <p className="text-[12px] text-slate-500">
                  {report.venueName} • ID: {report.id}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                {report.status || "In Progress"}
              </span>
            </div>

            {report.progress > 0 && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-[#ff7700] h-full rounded-full transition-all duration-300"
                  style={{ width: `${report.progress}%` }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
