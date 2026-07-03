import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAssignedReports } from './mockData';

export default function AuditDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate brief API loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 select-none">
        <div className="w-8 h-8 border-4 border-white/10 border-t-[#4ecdc4] rounded-full animate-spin"></div>
        <p className="text-xs text-white/70 font-light tracking-widest uppercase animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Derive stats
  const totalAssigned = mockAssignedReports.length;
  const inProgressReports = mockAssignedReports.filter(r => r.status === 'in_progress');
  const completedReports = mockAssignedReports.filter(r => r.status === 'completed');

  // Hardcoded username for now, can be replaced via auth service later
  const userName = "Yash";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleCardClick = (report) => {
    // Navigate to respective audit wizard if needed, or just log
    console.log("Navigating to report:", report.reportId);
    if (report.status === 'in_progress') {
      let path = '';
      if (report.reportName.includes('Venue')) path = 'venue-audit';
      else if (report.reportName.includes('Power')) path = 'power-audit';
      else if (report.reportName.includes('Network')) path = 'network-audit';
      
      if (path) {
        navigate(path, { state: { venue: report.venue, loadDraft: true } });
      }
    }
  };

  return (
    <div className="transition-opacity duration-300 ease-out opacity-100 flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-white/60 font-medium">
            You have {totalAssigned} assigned audits
          </p>
        </div>
        <button
          onClick={() => console.log('View all assigned audits clicked')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all whitespace-nowrap"
        >
          View All
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white mb-1">{totalAssigned}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Assigned</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-blue-400 mb-1">{inProgressReports.length}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">In Progress</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#4ecdc4]/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-[#4ecdc4] mb-1">{completedReports.length}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Completed</span>
        </div>
      </div>

      {/* Continue Working */}
      {inProgressReports.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Continue Working</h2>
          </div>
          <div className="flex flex-col gap-3">
            {inProgressReports.map((report) => (
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
      )}

      {/* Recently Completed */}
      {completedReports.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/90 uppercase tracking-widest">Recently Completed</h2>
          </div>
          <div className="flex flex-col gap-3">
            {completedReports.slice(0, 3).map((report) => (
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
      )}



    </div>
  );
}
