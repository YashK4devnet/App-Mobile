import { useContext } from 'react';
import { AuditContext } from '../../../stores/AuditContext';

export function useAssignedVenues() {
  const context = useContext(AuditContext);

  if (!context) {
    throw new Error('useAssignedVenues must be used within an AuditProvider');
  }

  const { venues, isLoading, error, connectionError, refreshData } = context;

  return { 
    venues, 
    isLoading, 
    error, 
    connectionError,
    refreshVenues: refreshData 
  };
}
