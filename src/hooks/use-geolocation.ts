
import { useState, useEffect } from 'react';

export interface GeolocationState {
  location: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  coordinates?: [number, number] | null; // Added for compatibility
}

export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
    coordinates: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: new GeolocationPositionError(),
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      // Create coordinates array for easy access
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
    };

    const watchId = navigator.geolocation.watchPosition(
      onSuccess, 
      onError, 
      options || defaultOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
};
