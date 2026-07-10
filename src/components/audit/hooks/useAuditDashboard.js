import { useState, useEffect } from 'react';
import { fetchAssignedAudits } from '../services/auditApi';

export const useAuditDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  const loadData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const data = await fetchAssignedAudits();
      setReports(data);
    } catch (err) {
      setError(err);
    } finally {
      if (!isRefreshing) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshDashboard = () => {
    return loadData(true);
  };

  const totalAssigned = reports.length;
  const inProgressReports = reports.filter(r => r.status === 'in_progress');
  const completedReports = reports.filter(r => r.status === 'completed');

  return {
    loading,
    error,
    reports,
    totalAssigned,
    inProgressReports,
    completedReports,
    refreshDashboard,
  };
};
