import { registerPlugin, Capacitor } from '@capacitor/core';

const NativeTracking = registerPlugin('NativeTracking');
const CALIBRATED_OFFSET_KEY = "server_time_offset_ms";

let cachedJsOffset = null;

/**
 * Reads the HTTP 'Date' header from any fetch/axios response object or headers instance
 * and updates the server_time_offset_ms in localStorage.
 */
const calibrateTimeFromResponse = (responseOrHeaders) => {
  try {
    let dateHeader = null;
    if (responseOrHeaders) {
      if (typeof responseOrHeaders.get === "function") {
        dateHeader = responseOrHeaders.get("Date") || responseOrHeaders.get("date");
      } else if (responseOrHeaders.headers && typeof responseOrHeaders.headers.get === "function") {
        dateHeader = responseOrHeaders.headers.get("Date") || responseOrHeaders.headers.get("date");
      } else if (responseOrHeaders.headers && typeof responseOrHeaders.headers === "object") {
        dateHeader = responseOrHeaders.headers["Date"] || responseOrHeaders.headers["date"];
      }
    }

    if (dateHeader) {
      const serverTimeMs = new Date(dateHeader).getTime();
      if (!isNaN(serverTimeMs)) {
        const offsetMs = serverTimeMs - Date.now();
        cachedJsOffset = offsetMs;
        localStorage.setItem(CALIBRATED_OFFSET_KEY, offsetMs.toString());
        console.log("⏱️ Server time offset calibrated:", offsetMs, "ms");
      }
    }
  } catch (err) {
    console.warn("Could not calibrate server time from response header:", err);
  }
};

/**
 * Returns a Date object adjusted by native true time calibration if available,
 * or latest calibrated server offset, falling back to local system time.
 */
const getAccurateTime = async (forceRefresh = false) => {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await NativeTracking.getTrueTime();
      if (res && res.trueTimeMs) {
        return new Date(res.trueTimeMs);
      }
    } catch (e) {
      console.warn("⚠️ NativeTracking.getTrueTime failed, falling back to web offset:", e);
    }
  }

  // Web Browser fallback using cached offset
  if (cachedJsOffset !== null && !forceRefresh) {
    return new Date(Date.now() + cachedJsOffset);
  }

  try {
    const rawOffset = localStorage.getItem(CALIBRATED_OFFSET_KEY);
    if (rawOffset !== null) {
      const offsetMs = Number(rawOffset);
      if (!isNaN(offsetMs)) {
        cachedJsOffset = offsetMs;
        return new Date(Date.now() + offsetMs);
      }
    }
  } catch (e) {}

  return new Date();
};

export { getAccurateTime, calibrateTimeFromResponse };




