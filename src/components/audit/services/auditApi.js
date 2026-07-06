import { mockAssignedReports } from '../pages/AuditDashboard/mockData';

/**
 * Fetches assigned audits from the backend.
 * Currently uses simulated delay and mock data.
 * When the backend is ready, replace the contents of this function with an actual API call (e.g., using fetch or axios).
 */
export const fetchAssignedAudits = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssignedReports);
    }, 400);
  });
};
