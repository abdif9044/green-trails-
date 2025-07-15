import { useEffect, useState } from 'react';
import { offlineManager } from '@/services/offline-manager';

export interface OfflineStatus {
  isOnline: boolean;
  hasOfflineData: boolean;
  storageUsage: { used: number; available: number };
  lastSync: number | null;
}

export const useOfflineCapability = () => {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    hasOfflineData: false,
    storageUsage: { used: 0, available: 0 },
    lastSync: null
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    const updateStorageUsage = async () => {
      const usage = await offlineManager.getStorageUsage();
      setStatus(prev => ({ ...prev, storageUsage: usage }));
    };

    // Initialize offline manager
    offlineManager.initialize().then(() => {
      updateStorageUsage();
    });

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Listen for online events to sync data
    window.addEventListener('online', () => {
      offlineManager.syncOfflineData().then(() => {
        setStatus(prev => ({ ...prev, lastSync: Date.now() }));
      });
    });

    // Update storage usage periodically
    const storageInterval = setInterval(updateStorageUsage, 30000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(storageInterval);
    };
  }, []);

  const cacheTrailForOffline = async (trail: any) => {
    await offlineManager.cacheTrailData(trail);
    await offlineManager.cacheMapData(trail);
    setStatus(prev => ({ ...prev, hasOfflineData: true }));
  };

  const getCachedTrail = async (trailId: string) => {
    return await offlineManager.getCachedTrailData(trailId);
  };

  const storeGPSPosition = async (position: any, trailId?: string) => {
    await offlineManager.storeGPSPosition(position, trailId);
  };

  const syncOfflineData = async () => {
    if (!status.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await offlineManager.syncOfflineData();
    setStatus(prev => ({ ...prev, lastSync: Date.now() }));
  };

  return {
    status,
    cacheTrailForOffline,
    getCachedTrail,
    storeGPSPosition,
    syncOfflineData
  };
};