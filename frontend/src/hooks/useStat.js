import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function useStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/getStats`, { credentials: 'include' });
        const data = await res.json();
        if (isMounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Something went wrong!');
        }
      }
    }
    fetchStats();
    return () => (isMounted = false);
  }, []);

  return { stats, error };
}
