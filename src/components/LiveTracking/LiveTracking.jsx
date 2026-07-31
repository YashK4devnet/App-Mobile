import React, { useState, useEffect } from 'react';
import { liveTrackingService } from '../../services/liveTrackingService';
import styles from './LiveTracking.module.css';

const LiveTracking = () => {
  const [isTracking, setIsTracking] = useState(liveTrackingService.getState().isTracking);
  const [lastLocation, setLastLocation] = useState(liveTrackingService.getState().lastLocation);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to tracking service state changes
    const unsubscribe = liveTrackingService.subscribe((state) => {
      setIsTracking(state.isTracking);
      setLastLocation(state.lastLocation);
      if (state.error) setError(state.error);
    });

    return unsubscribe;
  }, []);

  const startTracking = async () => {
    setError(null);
    try {
      await liveTrackingService.startTracking();
    } catch (err) {
      setError(err.message || 'Failed to start tracking');
    }
  };

  const stopTracking = async () => {
    try {
      await liveTrackingService.stopTracking();
    } catch (err) {
      setError(err.message || 'Failed to stop tracking');
    }
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
