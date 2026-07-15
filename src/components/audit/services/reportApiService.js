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
  },

  /**
   * Patches a specific lineField of a report with the provided array of lines.
   * @param {string|number} reportId - The ID of the report.
   * @param {string} lineField - The name of the field to update (e.g. "network_architecture_lines")
   * @param {Array} lines - The array of updated/new lines.
   */
  async patchAuditLines(reportId, lineField, lines) {
    const payload = {
      lineField,
      lines
    };

    try {
      if (!navigator.onLine) {
        throw new Error("Offline");
      }
      
      const response = await auditHttpClient(`/audits/${reportId}/lines`, {
        method: 'PATCH',
        headers: {
          'Odoo-DB': DB_NAME,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return response;
    } catch (error) {
      console.error(`Failed to patch lineField ${lineField} for report ${reportId}`, error);
      
      // If it's a network error (TypeError due to fetch failing) or explicitly Offline
      if (!navigator.onLine || error.message === 'Offline' || error.name === 'TypeError') {
        const taskId = `${reportId}_lines_${lineField}`;
        await storageService.addSyncTask({
          id: taskId,
          reportId,
          type: 'lines',
          lineField,
          payload,
          timestamp: Date.now()
        });
        
        const offlineError = new Error("OfflineSync");
        offlineError.isOffline = true;
        throw offlineError;
      }
      
      throw error;
    }
  },

  /**
   * Patches a general section of a report (for non-line fields like Venue Audit).
   */
  async patchAuditSection(reportId, payload) {
    try {
      if (!navigator.onLine) {
        throw new Error("Offline");
      }

      const response = await auditHttpClient(`/audits/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Odoo-DB': DB_NAME,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return response;
    } catch (error) {
      console.error(`Failed to patch section for report ${reportId}`, error);
      
      if (!navigator.onLine || error.message === 'Offline' || error.name === 'TypeError') {
        const taskId = `${reportId}_section`;
        await storageService.addSyncTask({
          id: taskId,
          reportId,
          type: 'section',
          payload,
          timestamp: Date.now()
        });
        
        const offlineError = new Error("OfflineSync");
        offlineError.isOffline = true;
        throw offlineError;
      }

      throw error;
    }
  }
};
