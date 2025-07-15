interface CacheItem {
  data: any;
  timestamp: number;
  expires?: number;
}

class OfflineManager {
  private cacheName = 'greentrails-offline-v1';
  private trailCacheName = 'greentrails-trails-v1';
  private dbName = 'GreenTrailsOffline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    // Initialize IndexedDB for offline GPS tracking
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for offline data
        if (!db.objectStoreNames.contains('trails')) {
          db.createObjectStore('trails', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('gpsPositions')) {
          const gpsStore = db.createObjectStore('gpsPositions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          gpsStore.createIndex('timestamp', 'timestamp');
          gpsStore.createIndex('trailId', 'trailId');
        }

        if (!db.objectStoreNames.contains('hikeSession')) {
          db.createObjectStore('hikeSession', { keyPath: 'id' });
        }
      };
    });
  }

  // Cache trail data for offline use
  async cacheTrailData(trail: any): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['trails'], 'readwrite');
      const store = transaction.objectStore('trails');
      
      const trailData = {
        ...trail,
        cachedAt: Date.now(),
        waypoints: trail.waypoints || [],
        elevationProfile: trail.elevation_profile || []
      };

      const request = store.put(trailData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached trail data
  async getCachedTrailData(trailId: string): Promise<any | null> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['trails'], 'readonly');
      const store = transaction.objectStore('trails');
      const request = store.get(trailId);

      request.onsuccess = () => {
        const result = request.result;
        if (result && this.isDataFresh(result.cachedAt, 24 * 60 * 60 * 1000)) { // 24 hours
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Store GPS position offline
  async storeGPSPosition(position: any, trailId?: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['gpsPositions'], 'readwrite');
      const store = transaction.objectStore('gpsPositions');
      
      const positionData = {
        ...position,
        trailId,
        timestamp: Date.now(),
        synced: false
      };

      const request = store.add(positionData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get stored GPS positions
  async getStoredGPSPositions(trailId?: string): Promise<any[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['gpsPositions'], 'readonly');
      const store = transaction.objectStore('gpsPositions');
      
      let request: IDBRequest;
      if (trailId) {
        const index = store.index('trailId');
        request = index.getAll(trailId);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Store hike session offline
  async storeHikeSession(session: any): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['hikeSession'], 'readwrite');
      const store = transaction.objectStore('hikeSession');
      
      const sessionData = {
        ...session,
        lastUpdated: Date.now(),
        synced: false
      };

      const request = store.put(sessionData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cache static assets using Service Worker Cache API
  async cacheStaticAssets(urls: string[]): Promise<void> {
    if (!('caches' in window)) return;

    const cache = await caches.open(this.cacheName);
    await cache.addAll(urls);
  }

  // Cache map tiles and trail images
  async cacheMapData(trail: any): Promise<void> {
    if (!('caches' in window)) return;

    const cache = await caches.open(this.trailCacheName);
    const urlsToCache: string[] = [];

    // Cache trail image
    if (trail.imageUrl) {
      urlsToCache.push(trail.imageUrl);
    }

    // Cache waypoint images
    if (trail.waypoints) {
      trail.waypoints.forEach((waypoint: any) => {
        if (waypoint.photos) {
          urlsToCache.push(...waypoint.photos);
        }
      });
    }

    if (urlsToCache.length > 0) {
      try {
        await cache.addAll(urlsToCache);
      } catch (error) {
        console.warn('Failed to cache some assets:', error);
      }
    }
  }

  // Sync offline data when online
  async syncOfflineData(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      // Sync GPS positions
      const positions = await this.getStoredGPSPositions();
      const unsyncedPositions = positions.filter(p => !p.synced);

      for (const position of unsyncedPositions) {
        // TODO: Send to server
        console.log('Syncing position:', position);
        // Mark as synced after successful upload
      }

      // Sync hike sessions
      // TODO: Implement hike session sync
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  // Check if data is fresh
  private isDataFresh(timestamp: number, maxAge: number): boolean {
    return Date.now() - timestamp < maxAge;
  }

  // Check connectivity status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0
      };
    }
    
    return { used: 0, available: 0 };
  }

  // Clear old cached data
  async clearOldData(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const cutoff = Date.now() - maxAge;
      const transaction = this.db.transaction(['gpsPositions'], 'readwrite');
      const store = transaction.objectStore('gpsPositions');
      const index = store.index('timestamp');
      
      const range = IDBKeyRange.upperBound(cutoff);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineManager = new OfflineManager();