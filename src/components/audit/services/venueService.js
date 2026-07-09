import { auditHttpClient } from './httpClient';

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
      const data = await auditHttpClient('/api/audit/locations');

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

      // Map the API fields to the fields expected by the frontend
      const mappedVenues = venuesList.map(venue => ({
        id: venue.id,
        venueName: venue.venue_name || venue.name || '',
        region: venue.region || '',
        state: venue.state || '',
        city: venue.city || '',
        address: venue.complete_venue_address || '',
        pinCode: venue.pin_code || '',
        // Keep original properties as well
        ...venue
      }));

      cachedData = mappedVenues;
      cacheTime = Date.now();
      return mappedVenues;
    } finally {
      activePromise = null;
    }
  })();

  return activePromise;
};

/**
 * Service to create a full audit record on the backend.
 */
export const createFullAuditRecord = async (payload) => {
  const responseData = await auditHttpClient('/api/audit/full-record', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return responseData;
};

/**
 * Service to update a full audit record on the backend via PATCH.
 */
export const updateFullAuditRecord = async (reportNo, payload) => {
  if (!reportNo) throw new Error("Report Number is required for PATCH update.");
  
  const responseData = await auditHttpClient(`/api/audit/full-record/${reportNo}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return responseData;
};
