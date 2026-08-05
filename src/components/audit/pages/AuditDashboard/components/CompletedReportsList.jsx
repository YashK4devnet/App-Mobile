import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApiService } from '../../../services/reportApiService';

export default function CompletedReportsList({ reports }) {
  const navigate = useNavigate();
  const [fetchingId, setFetchingId] = useState(null);

  const handleCardClick = async (report) => {
    try {
      setFetchingId(report.id || report.reportId);
      
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
    <div className="mb-8 select-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-widest">Recently Completed</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.slice(0, 3).map((report) => (
          <div
            key={report.id || report.reportId}
            onClick={() => handleCardClick(report)}
            className={`w-full p-4 bg-white border border-[#ff7700]/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:border-[#ff7700]/40 shadow-xs ${fetchingId === (report.id || report.reportId) ? 'opacity-50' : ''}`}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-[#0f172a] leading-tight mb-0.5">
                {report.reportName}
              </h3>
              <p className="text-[12px] text-slate-500 mb-1.5">
                {report.venue?.name || 'Venue ' + (report.venue || '')}
              </p>
              <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-md">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
