import { Capacitor, CapacitorHttp } from '@capacitor/core';

// Determine the correct base URL safely without crashing if process/import is undefined
const getBaseUrl = () => {
  if (!Capacitor.isNativePlatform()) {
    // In development mode on web, use the relative path to route through Vite's proxy (circumvents CORS)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      return '/api';
    }

    // For production web, try to use full environment URL if available
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
      if (url) return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
    }
    // Web fallback if no env variable is found
    return `${(import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com').replace(/\/$/, '')}/api`;
  }

  // Try Vite env variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
    if (url) return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
  }

  // Native production fallback
  return `${(import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com').replace(/\/$/, '')}/api`;
};

/**
 * A centralized API client strictly for the Audit Component.
 * Automatically switches between Capacitor Native HTTP (bypasses CORS) and Web Fetch.
 */
export const auditHttpClient = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const odooDb = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_DB)
    ? import.meta.env.VITE_API_DB
    : 'erp-eduquity-com';

  let userEmail = '';
  let serverApiKey = localStorage.getItem('serverApiKey') || '';

  try {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    userEmail = loginData.email || loginData.work_email || '';
    if (!serverApiKey) {
      serverApiKey = loginData['api-Key'] || loginData['api-key'] || loginData['api_key'] || '';
    }
  } catch (e) {
    console.error('Failed to parse loginData in httpClient:', e);
  }

  let url = `${baseUrl}${endpoint}`;
  const method = options.method || 'GET';

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'login': userEmail,
    'db': odooDb,
    'Odoo-DB': odooDb,
    'X-Odoo-Database': odooDb
  };
  if (serverApiKey) {
    defaultHeaders['api-key'] = serverApiKey;
  }

  if (Capacitor.isNativePlatform()) {
    console.log(`[auditHttpClient] Native ${method} to ${url}`);

    // Convert stringified body back to object for CapacitorHttp
    let data;
    if (options.body) {
      try { data = JSON.parse(options.body); }
      catch (e) { data = options.body; }
    }

    const response = await CapacitorHttp.request({
      url,
      method,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      },
      data
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`API Error (Capacitor): ${response.status}`);
    }

    let responseData = response.data;
    if (typeof responseData === 'string') {
      try { responseData = JSON.parse(responseData); } catch (e) { }
    }
    return responseData;
  } else {
    console.log(`[auditHttpClient] Web ${method} to ${url}`);
    const response = await fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      },
      body: options.body
    });

    if (!response.ok) {
      throw new Error(`API Error (Web): ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};
