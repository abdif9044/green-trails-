
import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  location: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  coordinates?: [number, number] | null;
  getCurrentLocation: () => Promise<GeolocationPosition>;
}

export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<{
    location: GeolocationPosition | null;
    error: GeolocationPositionError | null;
    loading: boolean;
    coordinates: [number, number] | null;
  }>({
    location: null,
    error: null,
    loading: true,
    coordinates: null,
  });

  const getCurrentLocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation not supported') as GeolocationPositionError;
        reject(error);
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [
            position.coords.longitude, 
            position.coords.latitude
          ];
          
          setState({
            location: position,
            error: null,
            loading: false,
            coordinates: coordinates,
          });
          
          resolve(position);
        },
        (error) => {
          setState(prev => ({
            ...prev,
            error,
            loading: false,
          }));
          reject(error);
        },
        defaultOptions
      );
    });
  }, [options]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: new Error('Geolocation not supported') as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const coordinates: [number, number] = [
        position.coords.longitude, 
        position.coords.latitude
      ];
      
      setState({
        location: position,
        error: null,
        loading: false,
        coordinates: coordinates,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        error,
        loading: false,
        coordinates: null,
      });
    };

    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };

    const watchId = navigator.geolocation.watchPosition(
      onSuccess, 
      onError, 
      defaultOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return {
    ...state,
    getCurrentLocation
  };
};
