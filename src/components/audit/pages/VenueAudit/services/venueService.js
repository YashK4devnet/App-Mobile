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
      // Use /api proxy to bypass CORS during development
      const url = "/api/venues";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch venues: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
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
