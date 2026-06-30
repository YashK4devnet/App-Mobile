import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAppRouting() {
  const [currentFlow, setCurrentFlow] = useState(null); // 'venue-audit' | 'power-audit' | 'audit-setup' | null
  const [setupVenue, setSetupVenue] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/audit-form')) {
      // Form view - handled inside the active wizard
    } else if (path.includes('/audit-index')) {
      // Index view - handled inside the active wizard
    } else if (path.includes('/setup-type')) {
      setCurrentFlow('audit-setup');
    } else if (path.includes('/setup-venue')) {
      setCurrentFlow('audit-setup');
    } else if (path.includes('/audit-setup')) {
      setCurrentFlow('audit-setup');
    } else if (path.includes('/venue-audit')) {
      setCurrentFlow('venue-audit');
    } else if (path.includes('/power-audit')) {
      setCurrentFlow('power-audit');
    } else if (path.includes('/network-audit')) {
      setCurrentFlow('network-audit');
    } else {
      // Dashboard / Home
      setCurrentFlow(null);
      setSetupVenue(null);
    }
  }, [location.pathname]);

  return {
    currentFlow,
    setCurrentFlow,
    setupVenue,
    setSetupVenue
  };
}
