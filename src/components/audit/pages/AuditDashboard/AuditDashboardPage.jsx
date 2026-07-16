import React, { useEffect } from 'react';
import { useAuditDashboard } from '../../hooks/useAuditDashboard';
import DashboardHeader from './components/DashboardHeader';
import QuickStats from './components/QuickStats';
import InProgressReportsList from './components/InProgressReportsList';
import CompletedReportsList from './components/CompletedReportsList';
import PullToRefresh from '../../components/PullToRefresh';

export default function AuditDashboardPage() {
  const {
    loading,
    error,
    connectionError,
    reports,
    totalAssigned,
    inProgressReports,
    completedReports,
    waitingForApprovalReports,
    approvedReports,
    rejectedReports,
    refreshDashboard,
  } = useAuditDashboard();

  useEffect(() => {
    refreshDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4 animate-pulse select-none">
        {/* Header Skeleton */}
        <div className="mb-8 mt-2">
          <div className="h-6 w-48 bg-white/10 rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-white/5 rounded-md"></div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
            <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
          </div>
        </div>

        {/* In Progress List Skeleton */}
        <div className="mb-8">
          <div className="h-3 w-36 bg-white/10 rounded mb-4"></div>
          <div className="flex flex-col gap-3">
            <div className="w-full h-28 bg-white/5 rounded-2xl border border-white/5"></div>
            <div className="w-full h-28 bg-white/5 rounded-2xl border border-white/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 select-none">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-sm text-red-400 font-medium">Failed to load dashboard data.</p>
        <button 
          onClick={refreshDashboard} 
          className="mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 text-xs font-semibold hover:bg-white/10 active:scale-95 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={refreshDashboard}>
      <div className="transition-opacity duration-300 ease-out opacity-100 flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4">
        {connectionError && (
          <div className="mb-4 flex items-center gap-2.5 px-4 py-3 bg-rose-500/10 border border-rose-500/25 text-rose-200 text-[13px] rounded-2xl shadow-lg backdrop-blur-md animate-fadeIn">
            <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <span className="font-semibold">Offline Mode.</span> Showing cached reports. Pull down to retry connection.
            </div>
          </div>
        )}
        <DashboardHeader totalAssigned={totalAssigned} />
        
        <QuickStats 
          totalAssigned={totalAssigned}
          inProgressCount={inProgressReports.length}
          completedCount={completedReports.length}
          waitingCount={waitingForApprovalReports.length}
          approvedCount={approvedReports.length}
          rejectedCount={rejectedReports.length}
        />

        <InProgressReportsList reports={inProgressReports} />
        <CompletedReportsList reports={completedReports} />
      </div>
    </PullToRefresh>
  );
}
