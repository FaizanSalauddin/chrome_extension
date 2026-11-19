import { useState, useEffect, useCallback, useMemo } from 'react';
import { WebsiteRecord } from '../types';
import {
  getWebsites,
  deleteWebsite,
  clearWebsites,
  subscribeToStorageChanges,
} from '../services/storage';

export function useWebsites() {
  const [websites, setWebsites] = useState<WebsiteRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWebsites();
      setWebsites(data);
    } catch (err) {
      console.error('Failed to load websites from storage:', err);
      setError('Unable to load extracted website data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebsites();

    // Storage change listener: updates automatically when extension extracts new websites
    const unsubscribe = subscribeToStorageChanges(() => {
      fetchWebsites();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchWebsites]);

  const removeWebsite = useCallback(async (id: string) => {
    try {
      await deleteWebsite(id);
      setWebsites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete website:', err);
      setError('Failed to delete website record.');
    }
  }, []);

  const clearAllWebsites = useCallback(async () => {
    try {
      await clearWebsites();
      setWebsites([]);
    } catch (err) {
      console.error('Failed to clear websites:', err);
      setError('Failed to clear website records.');
    }
  }, []);

  // Compute live statistics
  const stats = useMemo(() => {
    const totalWebsites = websites.length;
    let totalWords = 0;
    let totalImages = 0;
    let recentScans24h = 0;

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    websites.forEach((item) => {
      totalWords += item.wordCount || 0;
      totalImages += (item.images || []).length;

      const scanTime = new Date(item.extractedAt).getTime();
      if (!isNaN(scanTime) && scanTime > oneDayAgo) {
        recentScans24h += 1;
      }
    });

    return {
      totalWebsites,
      totalWords,
      totalImages,
      recentScans24h,
    };
  }, [websites]);

  return {
    websites,
    loading,
    error,
    stats,
    refresh: fetchWebsites,
    removeWebsite,
    clearAllWebsites,
  };
}
