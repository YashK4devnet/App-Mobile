import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getAccurateTime } from './timeService';

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
      const existingWatcherId = this.watcherId || localStorage.getItem('bg_watcher_id');
      if (existingWatcherId) {
        try {
          await BackgroundGeolocation.removeWatcher({ id: existingWatcherId });
        } catch (e) {}
        this.watcherId = null;
        localStorage.removeItem('bg_watcher_id');
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
      if (id) {
        localStorage.setItem('bg_watcher_id', String(id));
      }
      this.isTracking = true;
      this.notifyListeners();
      console.log('✅ Background tracking started with watcher ID:', id);
    } catch (err) {
      console.error('Failed to start tracking:', err);
      throw err;
    }
  }

  async stopTracking() {
    const activeId = this.watcherId || localStorage.getItem('bg_watcher_id');
    if (activeId) {
      try {
        await BackgroundGeolocation.removeWatcher({ id: activeId });
      } catch (e) {
        console.warn('Error removing background geolocation watcher:', e);
      }
      this.watcherId = null;
      localStorage.removeItem('bg_watcher_id');
    }
    try {
      await NativeTracking.stopTracking();
    } catch (e) {}
    this.isTracking = false;
    this.notifyListeners();
    console.log('🛑 Background tracking stopped.');
  }

  /**
   * Captures high-accuracy GPS position and posts a final location log to Odoo on Check-Out
   */
  async sendFinalCheckoutLocation() {
    try {
      const config = this.getTrackingConfig();
      if (!config.apiKey || !config.employeeId) return;

      const position = await new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => {
            console.warn('Checkout position capture error:', err);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      });

      if (position && position.coords) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('📍 [Checkout Location Update] Lat:', lat, 'Lng:', lng);

        const now = await getAccurateTime();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 8);

        const payload = {
          employee_id: Number(config.employeeId),
          latitude: lat,
          longitude: lng,
          date: dateStr,
          time: timeStr
        };

        await fetch(config.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': config.apiKey,
            'User-Agent': 'Mozilla/5.0 (Mobile; check-out-location)'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.warn('Checkout location POST error:', err));
      }
    } catch (err) {
      console.warn('Failed to send final checkout location:', err);
    }
  }

  getTrackingConfig() {
    let trackingEmployeeId = null;
    let apiKey = localStorage.getItem("serverApiKey") || "";
    try {
      const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
      if (!apiKey) {
        apiKey = loginData["api-Key"] || loginData["api-key"] || loginData["api_key"] || "";
      }
      if (loginData.employeeId || loginData.employee_id) {
        trackingEmployeeId = loginData.employeeId || loginData.employee_id;
      }
    } catch(e) {
      console.error("Failed to parse loginData for trackingEmployeeId", e);
    }
    
    let baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}`;
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    
    let endpointUrl = `${baseUrl}/api/employee/location/log`;
    endpointUrl = endpointUrl.replace(/\/api\/api\//g, '/api/');

    return { apiKey, employeeId: trackingEmployeeId, endpointUrl };
  }

  async flushOfflineQueue() {
    try {
      const config = this.getTrackingConfig();
      if (config.apiKey && config.employeeId) {
        console.log('🔄 Triggering manual flush of offline location queue...');
        await NativeTracking.flushQueue(config);
      }
    } catch (e) {
      console.warn('Manual offline location flush error:', e);
    }
  }

  async requestBatteryOptimizationExemption() {
    try {
      const res = await NativeTracking.requestIgnoreBatteryOptimizations();
      return res?.isIgnoring || false;
    } catch (e) {
      console.warn('Request battery optimization error:', e);
      return false;
    }
  }
}

// Export as a singleton
export const liveTrackingService = new LiveTrackingService();
