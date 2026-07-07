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
      <div className="flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4 animate-pulse select-none">
        {/* Header Skeleton */}
        <div className="mb-8 mt-2">
          <div className="h-6 w-48 bg-white/10 rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-white/5 rounded-md"></div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
          <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
          <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
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
