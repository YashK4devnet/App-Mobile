import { useContext } from 'react';
import { AuditContext } from '../stores/AuditContext';

export const useAuditDashboard = () => {
  const context = useContext(AuditContext);
  
  if (!context) {
    throw new Error('useAuditDashboard must be used within an AuditProvider');
  }

  const { reports, dashboardStats, isLoading, error, connectionError, refreshData } = context;

  return {
    loading: isLoading,
    error,
    connectionError,
    reports,
    totalAssigned: dashboardStats.totalAssigned,
    inProgressReports: dashboardStats.inProgressReports,
    completedReports: dashboardStats.completedReports,
    waitingForApprovalReports: dashboardStats.waitingForApprovalReports,
    approvedReports: dashboardStats.approvedReports,
    rejectedReports: dashboardStats.rejectedReports,
    refreshDashboard: refreshData,
  };
};
