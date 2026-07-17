import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auditHttpClient, setAuditApiKey } from '../services/httpClient';

export const AuditContext = createContext();

export const AuditProvider = ({ children, userId, apiKey }) => {
  useEffect(() => {
    if (apiKey) {
      setAuditApiKey(apiKey);
    }
  }, [apiKey]);

  // Synchronously load initial cache to avoid layout flashes
  const [reports, setReports] = useState(() => {
    try {
      const cached = localStorage.getItem(`audit_reports_cache_${userId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load initial cache', e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(() => {
    // If cache is present, don't show initial loading screen
    return reports.length === 0;
  });

  const [error, setError] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  const fetchAuditData = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing && reports.length === 0) setIsLoading(true);
    setError(null);
    
    try {
      const effectiveUserId = userId || 2;
      const url = `/audits/by-user/${effectiveUserId}`;
      console.log('Fetching centralized audit data from:', url);
      const data = await auditHttpClient(url);
      
      if (data && data.status === 'success') {
        const fetchedReports = data.data || [];
        setReports(fetchedReports);
        localStorage.setItem(`audit_reports_cache_${userId}`, JSON.stringify(fetchedReports));
        setConnectionError(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch audit data');
      }
    } catch (err) {
      console.error('Failed to fetch audit data:', err);
      setConnectionError(true);
      
      // We no longer set a blocking UI error here even if there are no reports.
      // This allows the dashboard to render an empty state gracefully instead of failing.
    } finally {
      setIsLoading(false);
    }
  }, [userId, reports.length]);

  useEffect(() => {
    fetchAuditData();
  }, [fetchAuditData]);

  const refreshData = () => {
    return fetchAuditData(true);
  };

  // Derived state: Dashboard Stats
  const dashboardStats = useMemo(() => {
    return {
      totalAssigned: reports.length,
      inProgressReports: reports.filter(r => r.state === 'in_progress'),
      completedReports: reports.filter(r => r.state !== 'assign_user' && r.state !== 'in_progress'),
      draftReports: reports.filter(r => r.state === 'draft'),
      waitingForApprovalReports: reports.filter(r => r.state === 'waiting_for_approval'),
      approvedReports: reports.filter(r => r.state === 'approved'),
      rejectedReports: reports.filter(r => r.state === 'reject'),
    };
  }, [reports]);

  const venues = useMemo(() => {
    const venueMap = reports.reduce((acc, report) => {
      const venue = report.venue;
      if (venue) {
        let vId, vName, vLocation;
        let vData = {};
        
        if (Array.isArray(venue)) {
          vId = venue[0]?.toString();
          vName = venue[1] || '';
          vLocation = '';
        } else if (typeof venue === 'object') {
          vId = venue.id?.toString();
          vName = venue.name || '';
          vLocation = venue.city || venue.state || '';
          vData = venue;
        } else {
          vId = venue?.toString();
          vName = `Venue ${vId}`;
          vLocation = '';
        }

        if (vId && !acc[vId]) {
          acc[vId] = {
            id: vId,
            name: vName,
            location: vLocation,
            status: 'Active',
            ...vData
          };
        }
      }
      return acc;
    }, {});
    return Object.values(venueMap);
  }, [reports]);

  return (
    <AuditContext.Provider 
      value={{ 
        reports, 
        venues, 
        dashboardStats, 
        isLoading, 
        error, 
        connectionError,
        refreshData 
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
