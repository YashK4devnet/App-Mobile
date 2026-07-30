import React, { useState, useEffect, useRef } from 'react';
import { registerPlugin } from '@capacitor/core';
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

      // 2. Create the location watcher
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

            // Enforce the 5-second interval before sending to the server
            const now = Date.now();
            if (now - lastApiCallTime.current >= TRACKING_INTERVAL_MS) {
              lastApiCallTime.current = now;
              mockApiCall(location.latitude, location.longitude);
            }
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

  const mockApiCall = (lat, lng) => {
    console.log(`📡 [MOCK API] Sending location to server -> lat: ${lat}, lng: ${lng}`);
    // fetch('https://your-api.com/update_location', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ lat, lng, timestamp: new Date().toISOString() })
    // });
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
