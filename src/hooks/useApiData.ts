import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiDataOptions<T> {
  fetchFn: () => Promise<T>;
  refreshInterval?: number; // ms, default 30000
}

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshing: boolean;
  refresh: () => void;
}

export function useApiData<T>({ fetchFn, refreshInterval = 30000 }: UseApiDataOptions<T>): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const lastDataRef = useRef<T | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      lastDataRef.current = result;
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "API error");
      // Keep last known data
      if (lastDataRef.current) {
        setData(lastDataRef.current);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), refreshInterval);
    return () => clearInterval(interval);
  }, [load, refreshInterval]);

  return { data, loading, error, lastUpdated, refreshing, refresh: () => load(true) };
}
