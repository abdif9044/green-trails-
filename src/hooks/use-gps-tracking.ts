import { useState, useEffect, useCallback, useRef } from 'react';

export interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  timestamp: number;
}

export interface GPSOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  trackingInterval?: number;
}

export interface UseGPSTrackingReturn {
  position: GPSPosition | null;
  isTracking: boolean;
  error: string | null;
  accuracy: number;
  startTracking: () => void;
  stopTracking: () => void;
  getCurrentPosition: () => Promise<GPSPosition>;
}

export const useGPSTracking = (options: GPSOptions = {}): UseGPSTrackingReturn => {
  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  
  const watchIdRef = useRef<number | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy ?? true,
    timeout: options.timeout ?? 15000,
    maximumAge: options.maximumAge ?? 60000
  };

  const handlePositionSuccess = useCallback((pos: GeolocationPosition) => {
    const newPosition: GPSPosition = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      altitude: pos.coords.altitude || undefined,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp
    };
    
    setPosition(newPosition);
    setAccuracy(pos.coords.accuracy);
    setError(null);
  }, []);

  const handlePositionError = useCallback((err: GeolocationPositionError) => {
    let errorMessage = 'Location access denied';
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location permissions.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
      default:
        errorMessage = 'Unknown location error occurred.';
    }
    
    setError(errorMessage);
    setIsTracking(false);
  }, []);

  const getCurrentPosition = useCallback((): Promise<GPSPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position: GPSPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude || undefined,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          };
          resolve(position);
        },
        (err) => reject(new Error(err.message)),
        defaultOptions
      );
    });
  }, [defaultOptions]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }

    if (isTracking) return;

    setIsTracking(true);
    setError(null);

    // Use watchPosition for continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionSuccess,
      handlePositionError,
      defaultOptions
    );

    // Optional: Additional polling for better accuracy
    if (options.trackingInterval) {
      trackingIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          handlePositionSuccess,
          handlePositionError,
          { ...defaultOptions, maximumAge: 0 }
        );
      }, options.trackingInterval);
    }
  }, [isTracking, handlePositionSuccess, handlePositionError, defaultOptions, options.trackingInterval]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    setIsTracking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    position,
    isTracking,
    error,
    accuracy,
    startTracking,
    stopTracking,
    getCurrentPosition
  };
};