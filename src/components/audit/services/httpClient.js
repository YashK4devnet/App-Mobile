import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { isAppOnline } from '../utils/connection';

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

let cachedApiKey = typeof localStorage !== 'undefined' ? localStorage.getItem('audit_api_key') : null;
let loginPromise = null;

const performSilentLogin = async (baseUrl, odooDb) => {
  if (!isAppOnline()) {
    throw new TypeError('Failed to fetch (simulated offline)');
  }
  // If the baseUrl is '/api' (web development), route to '/odoo_connect' so the proxy handles it.
  // Otherwise, strip the trailing '/api' from the baseUrl to point directly to the server's root.
  const url = baseUrl === '/api'
    ? '/odoo_connect'
    : `${baseUrl.replace(/\/api$/, '')}/odoo_connect`;
  const defaultHeaders = {
    'login': 'admin',
    'password': 'admin',
    'db': odooDb,
    'Content-Type': 'application/json'
  };

  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.request({
      url,
      method: 'GET',
      headers: defaultHeaders
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Silent Login Error (Capacitor): ${response.status}`);
    }
    let responseData = response.data;
    if (typeof responseData === 'string') {
      try { responseData = JSON.parse(responseData); } catch (e) { }
    }
    return responseData;
  } else {
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders
    });
    if (!response.ok) {
      throw new Error(`Silent Login Error (Web): ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};

/**
 * A centralized API client strictly for the Audit Component.
 * Automatically switches between Capacitor Native HTTP (bypasses CORS) and Web Fetch.
 */
export const auditHttpClient = async (endpoint, options = {}) => {
  if (!isAppOnline()) {
    throw new TypeError('Failed to fetch (simulated offline)');
  }
  const baseUrl = getBaseUrl();
  const odooDb = (typeof process !== 'undefined' && process.env && process.env.AUDIT_API_DB) || 'audit_rest_api';

  if (!cachedApiKey && endpoint !== '/odoo_connect') {
    if (!loginPromise) {
      loginPromise = performSilentLogin(baseUrl, odooDb).then(data => {
        if (data && data.status === 'success' && data['api-key']) {
          cachedApiKey = data['api-key'];
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('audit_api_key', cachedApiKey);
          }
        }
        return data;
      }).finally(() => {
        loginPromise = null;
      });
    }
    try {
      await loginPromise;
    } catch (err) {
      console.error('Silent login failed:', err);
      // Proceeding without api-key just in case it works or fails downstream
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
  if (cachedApiKey) {
    defaultHeaders['api-key'] = cachedApiKey;
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
