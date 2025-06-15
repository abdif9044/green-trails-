
import { useState, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { toast } from '@/hooks/use-toast';

export interface Weather3DLayer {
  id: string;
  type: 'clouds' | 'precipitation' | 'fog' | 'particles';
  intensity: number;
  elevation: number;
  visibility: boolean;
  animation: boolean;
}

export interface WeatherTimeFrame {
  timestamp: number;
  temperature: number;
  precipitation: number;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
}

export const use3DWeather = () => {
  const { map } = useMap();
  const [layers, setLayers] = useState<Weather3DLayer[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timeRange, setTimeRange] = useState({ start: Date.now(), end: Date.now() + 48 * 60 * 60 * 1000 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Add 3D volumetric clouds
  const addVolumetricClouds = async (intensity: number = 0.7) => {
    if (!map) return;

    try {
      // Add 3D terrain exaggeration for cloud elevation
      map.setTerrain({
        source: 'terrain',
        exaggeration: 2.0
      });

      // Add volumetric cloud source
      if (!map.getSource('volumetric-clouds')) {
        map.addSource('volumetric-clouds', {
          type: 'raster',
          tiles: [
            `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${await getWeatherApiKey()}`
          ],
          tileSize: 256
        });

        map.addLayer({
          id: 'volumetric-clouds',
          type: 'raster',
          source: 'volumetric-clouds',
          paint: {
            'raster-opacity': intensity,
            'raster-fade-duration': 1000,
            'raster-brightness-min': 0.1,
            'raster-brightness-max': 0.9,
            'raster-contrast': 0.3
          }
        });
      }

      const newLayer: Weather3DLayer = {
        id: 'volumetric-clouds',
        type: 'clouds',
        intensity,
        elevation: 2000,
        visibility: true,
        animation: false
      };

      setLayers(prev => [...prev.filter(l => l.id !== 'volumetric-clouds'), newLayer]);
    } catch (error) {
      console.error('Error adding volumetric clouds:', error);
      toast({
        title: "3D Weather Error",
        description: "Failed to load volumetric cloud data",
        variant: "destructive"
      });
    }
  };

  // Add animated precipitation particles
  const addPrecipitationParticles = (type: 'rain' | 'snow', intensity: number = 0.5) => {
    if (!map) return;

    try {
      const particleSource = {
        type: 'geojson' as const,
        data: {
          type: 'FeatureCollection' as const,
          features: generateParticleFeatures(type, intensity)
        }
      };

      const layerId = `precipitation-particles-${type}`;
      
      if (!map.getSource(layerId)) {
        map.addSource(layerId, particleSource);

        map.addLayer({
          id: layerId,
          type: 'circle',
          source: layerId,
          paint: {
            'circle-radius': type === 'rain' ? 2 : 4,
            'circle-color': type === 'rain' ? '#4A90E2' : '#FFFFFF',
            'circle-opacity': intensity,
            'circle-stroke-width': 1,
            'circle-stroke-color': type === 'rain' ? '#357ABD' : '#E0E0E0'
          }
        });
      }

      const newLayer: Weather3DLayer = {
        id: layerId,
        type: 'particles',
        intensity,
        elevation: 500,
        visibility: true,
        animation: true
      };

      setLayers(prev => [...prev.filter(l => l.id !== layerId), newLayer]);
    } catch (error) {
      console.error('Error adding precipitation particles:', error);
    }
  };

  // Generate particle features for animation
  const generateParticleFeatures = (type: 'rain' | 'snow', intensity: number) => {
    const features = [];
    const particleCount = Math.floor(intensity * 1000);
    
    for (let i = 0; i < particleCount; i++) {
      features.push({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [
            -180 + Math.random() * 360, // Random longitude
            -90 + Math.random() * 180   // Random latitude
          ]
        },
        properties: {
          type,
          velocity: type === 'rain' ? Math.random() * 5 + 2 : Math.random() * 2 + 0.5,
          size: type === 'rain' ? Math.random() * 2 + 1 : Math.random() * 4 + 2
        }
      });
    }
    
    return features;
  };

  // Animate weather through time
  const animateWeatherTime = (targetTime: number, duration: number = 2000) => {
    if (!map || isAnimating) return;

    setIsAnimating(true);
    const startTime = currentTime;
    const startAnimTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startAnimTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const interpolatedTime = startTime + (targetTime - startTime) * progress;
      setCurrentTime(interpolatedTime);

      // Update weather layers based on time
      updateWeatherLayersForTime(interpolatedTime);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  // Update weather layers based on current time
  const updateWeatherLayersForTime = (timestamp: number) => {
    if (!map) return;

    layers.forEach(layer => {
      if (layer.animation && map.getLayer(layer.id)) {
        // Update layer properties based on time
        const timeOfDay = new Date(timestamp).getHours();
        const dayNightFactor = Math.sin((timeOfDay / 24) * Math.PI * 2) * 0.3 + 0.7;
        
        if (layer.type === 'clouds') {
          map.setPaintProperty(layer.id, 'raster-opacity', layer.intensity * dayNightFactor);
        }
      }
    });
  };

  // Remove weather layer
  const removeWeatherLayer = (layerId: string) => {
    if (!map) return;

    try {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
      setLayers(prev => prev.filter(l => l.id !== layerId));
    } catch (error) {
      console.error('Error removing weather layer:', error);
    }
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: string) => {
    if (!map) return;

    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const newVisibility = !layer.visibility;
    
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', newVisibility ? 'visible' : 'none');
    }

    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, visibility: newVisibility } : l
    ));
  };

  // Get weather API key helper
  const getWeatherApiKey = async () => {
    // This would fetch from your weather service
    return 'your-weather-api-key';
  };

  return {
    layers,
    currentTime,
    timeRange,
    isAnimating,
    animationSpeed,
    addVolumetricClouds,
    addPrecipitationParticles,
    animateWeatherTime,
    removeWeatherLayer,
    toggleLayerVisibility,
    setAnimationSpeed,
    setTimeRange
  };
};
