import { storageService } from './storageService';
import { auditHttpClient } from './httpClient';

const DB_NAME = import.meta.env.VITE_AUDIT_API_DB || 'audit_rest_api';

export const reportApiService = {
  /**
   * Fetches a report by ID from Odoo and caches it in IndexedDB.
   * If the network fails, it attempts to load the last cached version.
   */
  async fetchReport(reportId) {
    try {
      const json = await auditHttpClient(`/audits/${reportId}`, {
        method: 'GET',
        headers: {
          'Odoo-DB': DB_NAME // Keep this specific header just in case it's specifically required by the audits endpoint
        }
      });
      
      // Assume the data we care about is inside json.data (based on get_reports_api_response.md)
      const reportData = json.data || json;
      
      // Save it to IndexedDB
      await storageService.saveReport(reportId.toString(), reportData);
      
      return reportData;
    } catch (error) {
      console.warn(`Network fetch failed for report ${reportId}, attempting to load from cache.`, error);
      
      // Try to load from offline cache
      const cachedData = await storageService.getReport(reportId.toString());
      if (cachedData) {
        return cachedData;
      }
      
      throw new Error(`Unable to fetch report ${reportId} and no offline cache found.`);
    }
  }
};
