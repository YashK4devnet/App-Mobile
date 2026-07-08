import { useState, useEffect, useCallback } from 'react';
import { CapacitorHttp, Capacitor } from '@capacitor/core';

export function useAssignedVenues() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = Capacitor.isNativePlatform() ? import.meta.env.VITE_API_URL : '/api';
      const url = `${baseUrl}/users/2/venues`;
      console.log('Fetching venues from URL:', url);
      
      const response = await CapacitorHttp.get({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('CapacitorHttp response:', JSON.stringify(response));

      let data = response.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
      }

      if (data && data.success) {
        const mappedVenues = data.venues.map(v => ({
          id: v.venue_id.toString(),
          name: v.venue_name,
          location: v.city,
          status: v.state ? 'Active' : 'Needs Attention'
        }));
        setVenues(mappedVenues);
      } else {
        throw new Error('Failed to fetch venues from server');
      }
    } catch (err) {
      console.error('Failed to fetch assigned venues:', err);
      setError(err.message || 'An error occurred while fetching venues');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const refreshVenues = () => {
    fetchVenues();
  };

  return { venues, isLoading, error, refreshVenues };
}
