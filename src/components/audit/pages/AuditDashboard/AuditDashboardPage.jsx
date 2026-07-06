import React from 'react';
import { useAuditDashboard } from '../../hooks/useAuditDashboard';
import DashboardHeader from './components/DashboardHeader';
import QuickStats from './components/QuickStats';
import InProgressReportsList from './components/InProgressReportsList';
import CompletedReportsList from './components/CompletedReportsList';

export default function AuditDashboardPage() {
  const {
    loading,
    error,
    reports,
    totalAssigned,
    inProgressReports,
    completedReports,
  } = useAuditDashboard();

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 select-none">
        <p className="text-sm text-red-400 font-medium">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="transition-opacity duration-300 ease-out opacity-100 flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4">
      <DashboardHeader totalAssigned={totalAssigned} />
      
      <QuickStats 
        totalAssigned={totalAssigned}
        inProgressCount={inProgressReports.length}
        completedCount={completedReports.length}
      />

      <InProgressReportsList reports={inProgressReports} />
      <CompletedReportsList reports={completedReports} />
    </div>
  );
}
