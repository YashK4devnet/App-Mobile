import { useState, useEffect } from 'react';
import { fetchAssignedAudits } from '../services/auditApi';

export const useAuditDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAssignedAudits();
        setReports(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
  };
};
