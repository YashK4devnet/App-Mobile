import { Capacitor, CapacitorHttp } from '@capacitor/core';

// Determine the correct base URL safely without crashing if process/import is undefined
const getBaseUrl = () => {
  if (!Capacitor.isNativePlatform()) {
    // If we're not on native, try Vite env first
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

/**
 * A centralized API client strictly for the Audit Component.
 * Automatically switches between Capacitor Native HTTP (bypasses CORS) and Web Fetch.
 */
export const auditHttpClient = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const method = options.method || 'GET';

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
        'Content-Type': 'application/json',
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
        'Content-Type': 'application/json',
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
