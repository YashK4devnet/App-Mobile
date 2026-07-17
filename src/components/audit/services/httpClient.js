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
      if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
      if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    }
    // Web fallback if no env variable is found
    return '/api';
  }

  // Try Vite env variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  }

  // Try Node/React env variables
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
    if (process.env.AUDIT_API_IP) {
      const cleanIp = process.env.AUDIT_API_IP.replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
      return `http://${cleanIp}`;
    }
  }

};

let currentApiKey = typeof localStorage !== 'undefined' ? localStorage.getItem('audit_api_key') : null;

export const setAuditApiKey = (key) => {
  currentApiKey = key;
  if (key && typeof localStorage !== 'undefined') {
    localStorage.setItem('audit_api_key', key);
  } else if (!key && typeof localStorage !== 'undefined') {
    localStorage.removeItem('audit_api_key');
  }
};

export const performSilentLogin = async () => {
  try {
    const db = (typeof process !== 'undefined' && process.env && process.env.AUDIT_API_DB) || 'audit_rest_api';
    const response = await auditHttpClient('/odoo_connect', {
      method: 'POST',
      body: JSON.stringify({
        login: 'admin',
        password: 'admin',
        db
      })
    });
    const key = response?.api_key || response?.data?.api_key || response?.result?.api_key;
    if (key) {
      setAuditApiKey(key);
      return key;
    }
    throw new Error('No API key returned from login');
  } catch (error) {
    console.error('Silent login failed:', error);
    throw error;
  }
};
/**
 * A centralized API client strictly for the Audit Component.
 * Automatically switches between Capacitor Native HTTP (bypasses CORS) and Web Fetch.
 */
export const auditHttpClient = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const odooDb = (typeof process !== 'undefined' && process.env && process.env.AUDIT_API_DB) || 'audit_rest_api';

  if (!currentApiKey && endpoint !== '/odoo_connect') {
    console.log('No API key found, attempting silent login...');
    try {
      await performSilentLogin();
    } catch (e) {
      throw new Error('Unauthorized: No API key provided and silent login failed.');
    }
  }

  const url = `${baseUrl}${endpoint}`;
  const method = options.method || 'GET';

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'login': 'admin'
  };
  if (odooDb) {
    defaultHeaders['X-Odoo-Database'] = odooDb;
  }
  if (currentApiKey) {
    defaultHeaders['api-key'] = currentApiKey;
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
