import { useState, useEffect } from 'react';
import { UserSession, UTMUrl } from '../types/analytics';
import { AnalyticsService } from '../services/analyticsService';

interface UseFirebaseAnalyticsReturn {
  sessions: UserSession[];
  utmUrls: UTMUrl[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useFirebaseAnalytics = (daysBack: number = 7): UseFirebaseAnalyticsReturn => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [utmUrls, setUtmUrls] = useState<UTMUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await AnalyticsService.getAnalyticsData(daysBack);
      
      setSessions(data.sessions);
      setUtmUrls(data.utmUrls);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [daysBack]);

  return {
    sessions,
    utmUrls,
    loading,
    error,
    refetch: fetchData,
    lastUpdated
  };
};