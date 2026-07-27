import { storageService } from './storageService';
import { auditHttpClient } from './httpClient';

const DB_NAME = import.meta.env.VITE_AUDIT_API_DB || 'erp-eduquity-com';

/**
 * Helper to check if an error is due to network connectivity failure,
 * Capacitor HTTP status 0, offline status, or server 5xx errors.
 */
const isNetworkOrServerError = (error) => {
  if (!navigator.onLine) return true;
  if (!error) return false;
  if (error.isOffline) return true;
  if (error.name === 'TypeError') return true;

  const msg = (error.message || '').toString().toLowerCase();
  const str = (error.toString() || '').toLowerCase();

  const networkKeywords = [
    'offline',
    'failed to fetch',
    'networkerror',
    'network request failed',
    'network error',
    'capacitor',
    ': 0',
    'status 0',
    'code 0',
    '500', '502', '503', '504',
    'load failed',
    'internet connection',
    'err_',
    'enotfound',
    'econnrefused',
    'econnreset',
    'etimedout',
    'timeout',
    'unknownhostexception',
    'unable to resolve host',
    'no address associated with hostname',
    'connectexception',
    'noroutetohostexception',
    'sockettimeoutexception',
    'socketexception',
    'sslhandshakeexception',
    'system error',
    'connection refused',
    'host unreachable',
    'could not connect',
    'api error (capacitor)'
  ];

  return networkKeywords.some(kw => msg.includes(kw) || str.includes(kw));
};

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
      
      if (isNetworkOrServerError(error)) {
        const taskId = `${reportId}_lines_${lineField}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
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
      
      if (isNetworkOrServerError(error)) {
        const taskId = `${reportId}_section_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
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
  },

  /**
   * Patches the bifurcation (labs/cctv) for a report using the lines endpoint.
   */
  async patchAuditBifurcation(reportId, payload) {
    const lineField = payload.type === 'cctv' ? 'cctv_bifurcation_ids' : 'lab_bifurcation_ids';
    const lines = (payload.lines || []).map(l => ({
      labId: String(l.labId),
      floorId: String(l.floorId),
      count: String(l.count)
    }));
    return this.patchAuditLines(reportId, lineField, lines);
  }
};
