import { useState, useEffect, useCallback } from 'react';
import { MOCK_REPORTS } from '../data/mockReports';

export function useAuditReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network request latency (800ms)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Replace the lines below with actual API call
      // const response = await axios.get('/api/reports');
      // setReports(response.data);
      
      setReports(MOCK_REPORTS);
    } catch (err) {
      console.error('Failed to fetch audit reports:', err);
      setError(err.message || 'An error occurred while fetching reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refreshReports = () => {
    fetchReports();
  };

  return { reports, isLoading, error, refreshReports };
}
