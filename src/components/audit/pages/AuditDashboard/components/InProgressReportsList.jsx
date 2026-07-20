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
        <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Continue Working</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.map((report) => (
          <button
            key={report.id || report.reportId}
            onClick={() => handleCardClick(report)}
            disabled={fetchingId === (report.id || report.reportId)}
            className={`w-full relative overflow-hidden group p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all text-left flex flex-col gap-2 ${fetchingId === (report.id || report.reportId) ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[14px] font-semibold text-white leading-tight mb-0.5 flex items-center gap-2">
                  {report.reportName}
                  {fetchingId === (report.id || report.reportId) && (
                    <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  )}
                </h3>
                <p className="text-[12px] text-white/60">
                  {report.venue?.name || 'Venue ' + (report.venue || '')}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-400 rounded-md">
                In Progress
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-blue-400 font-bold capitalize">
                  {report.reportType ? `${report.reportType.replace(/_audit/i, '')} Audit Report` : 'Audit Report'}
                </span>
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
