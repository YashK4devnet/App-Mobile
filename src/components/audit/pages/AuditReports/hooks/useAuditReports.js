import { useContext, useMemo } from 'react';
import { AuditContext } from '../../../stores/AuditContext';

const mapStateToDisplay = (state) => {
  switch (state) {
    case 'draft': return 'Draft';
    case 'assign_user': return 'Assigned';
    case 'in_progress': return 'In Progress';
    case 'waiting_for_approval': return 'Waiting for Approval';
    case 'approved': return 'Approved';
    case 'reject': return 'Rejected';
    default:
      // Fallback for custom or legacy states
      if (state) {
        return state.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
      return 'Completed';
  }
};

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
        name: r.reportName || r.systemAuditName || r.name,
        reportName: r.reportName || r.systemAuditName || r.name,
        status: mapStateToDisplay(r.state),
        venueName: vName,
        venue_id: vId,
        date: r.auditDate || r.date,
        type: r.reportType || 'Audit',
        auditType: r.reportType ? r.reportType.replace('_', ' ') : 'Audit',
        reportType: r.reportType,
        auditorName: r.auditorName || (r.auditors && r.auditors[0] ? r.auditors[0].auditor : 'N/A'),
        progress: r.completionPercentage || r.progress || 0,
        issuesFound: r.issuesFound || 0,
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
