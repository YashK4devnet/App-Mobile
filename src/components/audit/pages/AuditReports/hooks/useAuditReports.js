import { useContext, useMemo } from 'react';
import { AuditContext } from '../../../stores/AuditContext';

export function useAuditReports(venueId) {
  const context = useContext(AuditContext);

  if (!context) {
    throw new Error('useAuditReports must be used within an AuditProvider');
  }

  const { reports, isLoading, error, refreshData } = context;

  // Filter reports by the requested venueId and map fields as expected by UI
  const filteredReports = useMemo(() => {
    if (!venueId) return [];

    let mappedReports = reports.map(r => {
      // Map API fields to UI expected fields
      let vId = '';
      let vName = '';
      if (r.venue) {
        if (Array.isArray(r.venue)) {
          vId = r.venue[0]?.toString() || '';
          vName = r.venue[1] || '';
        } else if (typeof r.venue === 'object') {
          vId = r.venue.id?.toString() || '';
          vName = r.venue.name || '';
        } else {
          vId = r.venue.toString();
        }
      }

      return {
        id: r.id ? r.id.toString() : r.reference,
        name: r.reportName || r.systemAuditName,
        status: r.state || 'Completed',
        venueName: vName,
        venue_id: vId,
        date: r.auditDate,
        type: r.reportType || 'Audit'
      };
    });

    return mappedReports.filter(r => r.venue_id === venueId.toString());
  }, [reports, venueId]);

  return { 
    reports: filteredReports, 
    isLoading, 
    error, 
    refreshReports: refreshData 
  };
}
