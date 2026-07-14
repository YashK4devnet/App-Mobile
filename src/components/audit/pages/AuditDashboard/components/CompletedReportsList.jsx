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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Recently Completed</h2>
      </div>
      <div className="flex flex-col gap-3">
        {reports.slice(0, 3).map((report) => (
          <div
            key={report.id || report.reportId}
            onClick={() => handleCardClick(report)}
            className={`w-full p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-white/10 ${fetchingId === (report.id || report.reportId) ? 'opacity-50' : ''}`}
          >
            <div>
              <h3 className="text-[15px] font-medium text-white/90 leading-tight mb-0.5">
                {report.reportName}
              </h3>
              <p className="text-[12px] text-white/50 mb-1.5">
                {report.venue?.name || 'Venue ' + (report.venue || '')}
              </p>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-purple-500/20 text-purple-400 rounded-md">
                Completed
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[10px] text-white/40 font-medium">{report.completedAt || new Date(report.date || new Date()).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
