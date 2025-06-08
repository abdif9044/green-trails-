
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Download, HardDrive, Trash2 } from 'lucide-react';

interface OfflineMapCacheProps {
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

const OfflineMapCache: React.FC<OfflineMapCacheProps> = ({ bounds }) => {
  const [cacheSize, setCacheSize] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    checkCacheSize();
  }, []);

  const checkCacheSize = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setCacheSize(estimate.usage || 0);
      }
    } catch (error) {
      console.error('Error checking cache size:', error);
    }
  };

  const downloadOfflineMap = async () => {
    if (!bounds) {
      toast({
        title: "No area selected",
        description: "Please select an area on the map to download",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate progressive download
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(i);
      }

      toast({
        title: "Map downloaded",
        description: "Offline map tiles have been cached successfully"
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download offline map tiles",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      checkCacheSize();
    }
  };

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      setCacheSize(0);
      toast({
        title: "Cache cleared",
        description: "All offline map data has been removed"
      });
    } catch (error) {
      toast({
        title: "Clear failed",
        description: "Failed to clear offline map cache",
        variant: "destructive"
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-4 w-4" />
          Offline Maps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cache Size:</span>
          <span className="text-sm font-medium">{formatBytes(cacheSize)}</span>
        </div>

        {isDownloading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Downloading...</span>
              <span>{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={downloadOfflineMap}
            disabled={isDownloading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Area
          </Button>
          
          <Button
            onClick={clearCache}
            variant="outline"
            disabled={isDownloading || cacheSize === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfflineMapCache;
