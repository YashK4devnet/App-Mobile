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

  async fetchLineImage(questionId) {
    if (!questionId) return null;
    
    try {
      // First check cache
      const cacheKey = `image_${questionId}`;
      const cached = await storageService.getImage(cacheKey);
      if (cached) return cached;
      
      const json = await auditHttpClient(`/audits/lines/${questionId}/image`, {
        method: 'GET',
        headers: {
          'Odoo-DB': DB_NAME
        }
      });
      
      let b64 = json?.images?.image || json?.image;
      if (b64) {
        // Handle double-encoded base64 (Odoo sometimes returns base64 of base64)
        // If it starts with "Lzl", it's the base64 encoding of "/9j" which is the start of a jpeg base64
        if (b64.startsWith('Lzl')) {
          try {
            b64 = atob(b64);
          } catch (e) {
            console.warn("Failed to decode double-encoded base64", e);
          }
        }
        
        await storageService.saveImage(cacheKey, b64);
        return b64;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch image for question ${questionId}`, error);
      return null;
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
      
      const isNetworkError = !navigator.onLine || 
        error.name === 'TypeError' || 
        (error.message && (
          error.message === 'Offline' || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('502') || 
          error.message.includes('503') || 
          error.message.includes('504') ||
          error.message.includes('500')
        ));
      
      // If it's a network error or server is down/unreachable
      if (isNetworkError) {
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
      
      const isNetworkError = !navigator.onLine || 
        error.name === 'TypeError' || 
        (error.message && (
          error.message === 'Offline' || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('502') || 
          error.message.includes('503') || 
          error.message.includes('504') ||
          error.message.includes('500')
        ));
      
      if (isNetworkError) {
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
