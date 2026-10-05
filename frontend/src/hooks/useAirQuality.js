import { useState, useCallback, useRef } from 'react';
import { fetchAirQuality } from '../utils/api';

export function useAirQuality() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const refreshRef = useRef(null);

  const load = useCallback(async (lat, lon, city, country) => {
    setLoading(true);
    setError(null);
    if (refreshRef.current) clearInterval(refreshRef.current);

    const doFetch = async () => {
      try {
        const res = await fetchAirQuality(lat, lon, city, country);
        setData(res.data.data);
        setLoading(false);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Failed to fetch air quality data.';
        setError(msg);
        setLoading(false);
      }
    };

    await doFetch();
    // Auto-refresh every 10 minutes
    refreshRef.current = setInterval(doFetch, 10 * 60 * 1000);
    return () => clearInterval(refreshRef.current);
  }, []);

  return { data, loading, error, load };
}
