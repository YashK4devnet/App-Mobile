import { Capacitor, CapacitorHttp } from '@capacitor/core';

/**
 * Service to fetch saved venues from the API.
 */
let activePromise = null;
let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

export const fetchSavedVenues = async () => {
  const now = Date.now();
  if (cachedData && (now - cacheTime < CACHE_DURATION)) {
    console.log("fetchSavedVenues returning cached data");
    return cachedData;
  }

  if (activePromise) {
    console.log("fetchSavedVenues reusing in-flight request promise");
    return activePromise;
  }

  activePromise = (async () => {
    try {
      let data;

      if (Capacitor.isNativePlatform()) {
        const ipAddress = process.env.AUDIT_API_IP;
        let url;

        if (ipAddress) {
          const cleanIp = ipAddress.replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
          url = `http://${cleanIp}/api/audit/locations`;
        } else {
          // If no IP is configured, check if we're running via live-reload (which exposes the developer host IP)
          const hostname = window.location.hostname;
          if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0') {
            url = `http://${hostname}:8099/api/audit/locations`;
          } else {
            // Fall back to the configured local host IP address 192.168.29.191:8099
            url = 'http://192.168.29.191:8099/api/audit/locations';
          }
        }

        console.log("fetchSavedVenues requesting native URL:", url);
        const response = await CapacitorHttp.request({
          method: 'GET',
          url: url,
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Failed to fetch venues (Capacitor): ${response.status}`);
        }

        data = response.data;
        // In case CapacitorHttp didn't parse it automatically
        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch (e) { }
        }
      } else {
        // Use /api proxy to bypass CORS during browser development
        const url = "/api/audit/locations";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch venues: ${response.status} ${response.statusText}`);
        }
        data = await response.json();
      }

      console.log("fetchSavedVenues response data:", data);

      let venuesList = [];
      if (Array.isArray(data)) {
        venuesList = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.results)) {
          venuesList = data.results;
        } else if (Array.isArray(data.venues)) {
          venuesList = data.venues;
        } else if (Array.isArray(data.data)) {
          venuesList = data.data;
        } else if (Array.isArray(data.result)) {
          venuesList = data.result;
        } else if (data.result && typeof data.result === 'object') {
          if (Array.isArray(data.result.results)) {
            venuesList = data.result.results;
          } else if (Array.isArray(data.result.venues)) {
            venuesList = data.result.venues;
          } else if (Array.isArray(data.result.data)) {
            venuesList = data.result.data;
          }
        }
      }

      cachedData = venuesList;
      cacheTime = Date.now();
      return venuesList;
    } finally {
      activePromise = null;
    }
  })();

  return activePromise;
};
