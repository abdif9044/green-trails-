
import { useState, useEffect } from 'react';

export interface GeolocationState {
  location: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
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
      setState({
        location: position,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        error,
        loading: false,
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
