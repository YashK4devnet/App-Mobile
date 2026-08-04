import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const NativeTracking = registerPlugin('NativeTracking');
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

class LiveTrackingService {
  constructor() {
    this.watcherId = null;
    this.isTracking = false;
    this.listeners = new Set();
    this.lastLocation = null;
  }

  /**
   * Register a listener for state changes (useful for UI components)
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  getState() {
    return {
      isTracking: this.isTracking,
      lastLocation: this.lastLocation,
      error: null
    };
  }

  async startTracking() {
    if (this.isTracking) {
      console.log('✅ Background tracking is already running');
      return;
    }

    try {
      // 1. Request notification permissions (required for Android 13+ Foreground Service)
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      if (permStatus.display !== 'granted') {
        throw new Error("Notification permission is required for background tracking.");
      }

      // 2. Configure our Custom Native Tracking Plugin
      const apiKey = localStorage.getItem("serverApiKey") || "";
      
      // Parse employee_id strictly
      let trackingEmployeeId = null;
      try {
        const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
        if (loginData.employeeId || loginData.employee_id) {
          trackingEmployeeId = loginData.employeeId || loginData.employee_id;
        }
      } catch(e) {
        console.error("Failed to parse loginData for trackingEmployeeId", e);
      }
      
      if (!trackingEmployeeId) {
        console.warn("⚠️ No employee ID found for background tracking.");
      }
      
      let baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}`;
      if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
      
      // Ensure we don't accidentally duplicate /api if the user's base URL already includes it
      let endpointUrl = `${baseUrl}/api/employee/location/log`;
      endpointUrl = endpointUrl.replace(/\/api\/api\//g, '/api/');
      
      await NativeTracking.setConfig({ apiKey, employeeId: trackingEmployeeId, endpointUrl, interval: 900000 });

      // Clean up any stale watcher if present before creating a new one
      if (this.watcherId) {
        try {
          await BackgroundGeolocation.removeWatcher({ id: this.watcherId });
        } catch (e) {}
        this.watcherId = null;
      }

      // 3. Create the location watcher
      const id = await BackgroundGeolocation.addWatcher(
        {
          requestPermissions: true, // Request permissions if missing
          stale: false, // Don't use stale cached locations
          distanceFilter: 0, // 0 = send updates regardless of distance moved
          backgroundMessage: "Tracking your location for attendance.",
          backgroundTitle: "Live Tracking Active",
          icon: "ic_notification_location",
        },
        (location, error) => {
          if (error) {
            if (error.code === 'NOT_AUTHORIZED') {
              console.error('Location permissions not granted');
            } else {
              console.error('Background geolocation error:', error);
            }
            return;
          }

          if (location) {
            console.log('📍 [Background] New location received:', location);
            this.lastLocation = { lat: location.latitude, lng: location.longitude };
            this.notifyListeners();
          }
        }
      );

      this.watcherId = id;
      this.isTracking = true;
      this.notifyListeners();
      console.log('✅ Background tracking started with watcher ID:', id);
    } catch (err) {
      console.error('Failed to start tracking:', err);
      throw err;
    }
  }

  async stopTracking() {
    if (this.watcherId) {
      try {
        await BackgroundGeolocation.removeWatcher({ id: this.watcherId });
      } catch (e) {}
      this.watcherId = null;
    }
    try {
      await NativeTracking.stopTracking();
    } catch (e) {}
    this.isTracking = false;
    this.notifyListeners();
    console.log('🛑 Background tracking stopped.');
  }
}

// Export as a singleton
export const liveTrackingService = new LiveTrackingService();
