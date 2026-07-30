import React, { useState, useEffect, useRef } from 'react';
import { registerPlugin } from '@capacitor/core';
const NativeTracking = registerPlugin('NativeTracking');
import { LocalNotifications } from '@capacitor/local-notifications';
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');
import styles from './LiveTracking.module.css';

const LiveTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [watcherId, setWatcherId] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [error, setError] = useState(null);
  const lastApiCallTime = useRef(0);
  const TRACKING_INTERVAL_MS = 5000; // 5 seconds

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watcherId) {
        BackgroundGeolocation.removeWatcher({ id: watcherId });
      }
    };
  }, [watcherId]);

  const startTracking = async () => {
    setError(null);
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
      const employeeId = localStorage.getItem("employeeId") || "";
      
      let baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}`;
      if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
      
      // Ensure we don't accidentally duplicate /api if the user's base URL already includes it
      let endpointUrl = `${baseUrl}/api/employee/location/log`;
      endpointUrl = endpointUrl.replace(/\/api\/api\//g, '/api/');
      
      await NativeTracking.setConfig({ apiKey, employeeId, endpointUrl });

      // 3. Create the location watcher
      const id = await BackgroundGeolocation.addWatcher(
        {
          requestPermissions: true, // Request permissions if missing
          stale: false, // Don't use stale cached locations
          distanceFilter: 0, // 0 = send updates regardless of distance moved
          backgroundMessage: "Tracking your location for attendance.",
          backgroundTitle: "Live Tracking Active",
        },
        function callback(location, error) {
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
            setLastLocation({ lat: location.latitude, lng: location.longitude });
          }
        }
      );

      setWatcherId(id);
      setIsTracking(true);
      console.log('✅ Background tracking started with watcher ID:', id);
    } catch (err) {
      console.error('Failed to start tracking:', err);
      setError(err.message || 'Failed to start tracking');
    }
  };

  const stopTracking = async () => {
    if (watcherId) {
      await BackgroundGeolocation.removeWatcher({ id: watcherId });
      setWatcherId(null);
    }
    setIsTracking(false);
    console.log('🛑 Background tracking stopped.');
  };



  return (
    <div className={styles.trackingContainer}>
      <h3 className={styles.title}>Live Background Tracking (Test)</h3>
      <p className={styles.status}>
        Status: <strong>{isTracking ? 'Tracking Active 🟢' : 'Inactive 🔴'}</strong>
      </p>

      {lastLocation && (
        <p className={styles.location}>
          Last known: {lastLocation.lat.toFixed(5)}, {lastLocation.lng.toFixed(5)}
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonGroup}>
        <button
          className={styles.startButton}
          onClick={startTracking}
          disabled={isTracking}
        >
          Start Live Tracking
        </button>
        <button
          className={styles.stopButton}
          onClick={stopTracking}
          disabled={!isTracking}
        >
          Stop Tracking
        </button>
      </div>
    </div>
  );
};

export default LiveTracking;
