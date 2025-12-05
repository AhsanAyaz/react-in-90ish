import { useEffect, useState, useCallback } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export function useAImonGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/api/gallery`);
      if (!res.ok) throw new Error("Failed to load gallery");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { data, loading, error, refetch: fetchGallery };
}
