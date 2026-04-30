import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get("/schedules/getSchedules");
        if (!cancelled) setSchedules(res.data);
      } catch {
        if (!cancelled) setSchedules([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { schedules, loading, refresh };
};

export default useSchedules;
