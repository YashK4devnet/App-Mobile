import { useState, useEffect, useCallback } from 'react';
import { auditHttpClient } from '../../../services/httpClient';

export function useAssignedVenues() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auditHttpClient('/users/2/venues');
      console.log('auditHttpClient response:', JSON.stringify(data));

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
    return fetchVenues();
  };

  return { venues, isLoading, error, refreshVenues };
}
