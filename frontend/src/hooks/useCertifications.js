import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLang } from '../context/LangContext';

const useCertifications = () => {
  const { locale } = useLang();
  const [tracks, setTracks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true); setError(null);
        const { data } = await api.get(`/tracks?locale=${locale}`);
        if (!cancelled) setTracks(data.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load programmes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [locale]);

  return { tracks, loading, error };
};

export default useCertifications;
