import { useState, useEffect, useCallback } from 'react';
import { CapacitorHttp, Capacitor } from '@capacitor/core';

export function useAuditReports(venueId) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!venueId) {
      setReports([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = Capacitor.isNativePlatform() ? import.meta.env.VITE_API_URL : '/api';
      const url = `${baseUrl}/users/2/reports`;
      console.log('Fetching reports from URL:', url);
      
      const response = await CapacitorHttp.get({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('CapacitorHttp reports response:', JSON.stringify(response));

      let data = response.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
      }

      if (data && data.success) {
        let mappedReports = data.reports.map(r => ({
          id: r.report_id.toString(),
          name: r.report_name,
          status: 'Completed',
          venueName: r.venue_name,
          venue_id: r.venue_id.toString(),
          date: r.audit_date,
          type: r.report_type
        }));

        mappedReports = mappedReports.filter(r => r.venue_id === venueId.toString());
        setReports(mappedReports);
      } else {
        throw new Error('Failed to fetch reports from server');
      }
    } catch (err) {
      console.error('Failed to fetch audit reports:', err);
      setError(err.message || 'An error occurred while fetching reports');
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refreshReports = () => {
    return fetchReports();
  };

  return { reports, isLoading, error, refreshReports };
}
