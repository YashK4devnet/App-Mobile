import { useState, useEffect, useCallback } from 'react';
import { MOCK_VENUES } from '../data/mockVenues';

export function useAssignedVenues() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network request latency (600ms)
      await new Promise(resolve => setTimeout(resolve, 600));
      setVenues(MOCK_VENUES);
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
